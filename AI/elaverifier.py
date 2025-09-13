import cv2
import numpy as np
from PIL import Image
import os

def detect_tampering_with_boxes(image_path):
    try:
        original_pil = Image.open(image_path)
        if original_pil.mode != 'RGB':
            original_pil = original_pil.convert('RGB')
        
        original_for_boxes = cv2.imread(image_path)
        
        qualities = [85, 75, 95]
        max_score = 0
        best_ela = None
        best_quality = 85
        
        for quality in qualities:
            original_pil.save('temp.jpg', 'JPEG', quality=quality)
            
            original = cv2.imread(image_path)
            recompressed = cv2.imread('temp.jpg')
            
            if original.shape != recompressed.shape:
                recompressed = cv2.resize(recompressed, (original.shape[1], original.shape[0]))
            
            diff = cv2.absdiff(original, recompressed)
            enhanced_diff = diff * 15
            enhanced_diff = np.clip(enhanced_diff, 0, 255)
            gray_diff = cv2.cvtColor(enhanced_diff.astype(np.uint8), cv2.COLOR_BGR2GRAY)
            
            std_dev = np.std(gray_diff)
            mean_val = np.mean(gray_diff)
            max_val = np.max(gray_diff)
            high_error_pixels = np.sum(gray_diff > 30) / gray_diff.size
            very_high_error_pixels = np.sum(gray_diff > 100) / gray_diff.size
            
            current_score = (std_dev * 0.4 + mean_val * 0.3 + max_val * 0.1 + 
                           high_error_pixels * 100 + very_high_error_pixels * 200)
            
            if current_score > max_score:
                max_score = current_score
                best_ela = gray_diff
                best_quality = quality
        
        boxes = []
        marked_image = original_for_boxes.copy()
        
        if best_ela is not None:
            threshold_value = max(25, int(np.mean(best_ela) + 2 * np.std(best_ela)))
            _, mask = cv2.threshold(best_ela, threshold_value, 255, cv2.THRESH_BINARY)
            
            kernel = np.ones((5, 5), np.uint8)
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
            
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in contours:
                x, y, w, h = cv2.boundingRect(contour)
                
                min_size = 20
                if w > min_size and h > min_size:
                    region_ela = best_ela[y:y+h, x:x+w]
                    region_score = np.mean(region_ela) + np.std(region_ela)
                    
                    if region_score > 15:
                        boxes.append((x, y, w, h, region_score))
            
            boxes.sort(key=lambda box: box[4], reverse=True)
            
            box_count = 0
            for i, (x, y, w, h, region_score) in enumerate(boxes):
                if box_count >= 5:
                    break
                
                if region_score > 50:
                    color = (0, 0, 255)
                    thickness = 3
                elif region_score > 25:
                    color = (0, 165, 255)
                    thickness = 2
                else:
                    color = (0, 255, 255)
                    thickness = 2
                
                cv2.rectangle(marked_image, (x, y), (x + w, y + h), color, thickness)
                box_count += 1
        
        if os.path.exists('temp.jpg'):
            os.remove('temp.jpg')
        
        threshold = 8.0
        result = "TAMPERED" if max_score > threshold else "GENUINE"
        
        simple_boxes = [(x, y, w, h) for x, y, w, h, _ in boxes[:5]]
        
        return result, max_score, best_ela, simple_boxes, marked_image
        
    except Exception as e:
        print(f"Error analyzing image: {e}")
        return "ERROR", 0, None, [], None

def check_identity_card(image_path, base_name=None):
    if not os.path.exists(image_path):
        print("Image file not found")
        return None
    
    result, score, ela_image, boxes, marked_image = detect_tampering_with_boxes(image_path)
    
    if result == "ERROR":
        print("Could not analyze image")
        return None
    
    # Use provided base_name or extract from image path
    if base_name is None:
        base_name = os.path.splitext(os.path.basename(image_path))[0]
    
    # Save images in the AI directory
    ai_dir = os.path.dirname(os.path.abspath(__file__))
    analysis_path = os.path.join(ai_dir, f"{base_name}_ela_analysis.jpg")
    marked_path = os.path.join(ai_dir, f"{base_name}_with_boxes.jpg")
    
    if ela_image is not None:
        cv2.imwrite(analysis_path, ela_image)
        print(f"Analysis file created: {analysis_path}")
    
    if marked_image is not None:
        cv2.imwrite(marked_path, marked_image)
        print(f"Boxed image created: {marked_path}")
    
    if result == "TAMPERED":
        if score > 25:
            risk_level = "HIGH"
        elif score > 15:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
    else:
        risk_level = "NOT TAMPERED"
    
    print(f"Score: {score:.2f}")
    print(f"Risk Level: {risk_level}")
    
    return {
        "verdict": result,
        "score": score,
        "risk_level": risk_level,
        "boxes": boxes
    }

if __name__ == "__main__":
    image_path = input("Enter path to image: ")
    check_identity_card(image_path)