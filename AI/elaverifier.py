import cv2
import numpy as np
from PIL import Image
import os
import tempfile

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
        
        # Create temp file in same directory as input image for recompression
        temp_dir = os.path.dirname(image_path)
        temp_file = os.path.join(temp_dir, 'temp_recompressed.jpg')
        
        for quality in qualities:
            original_pil.save(temp_file, 'JPEG', quality=quality)
            
            original = cv2.imread(image_path)
            recompressed = cv2.imread(temp_file)
            
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
                    color = (0, 0, 255)  # Red for high suspicion
                    thickness = 3
                    label = "HIGH RISK"
                elif region_score > 25:
                    color = (0, 165, 255)  # Orange for medium suspicion
                    thickness = 2
                    label = "MEDIUM RISK"
                else:
                    color = (0, 255, 255)  # Yellow for low suspicion
                    thickness = 2
                    label = "LOW RISK"
                
                cv2.rectangle(marked_image, (x, y), (x + w, y + h), color, thickness)
                # Add text label above the box
                cv2.putText(marked_image, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                box_count += 1
        
        # Clean up temp file
        if os.path.exists(temp_file):
            os.remove(temp_file)
        
        threshold = 8.0
        result = "TAMPERED" if max_score > threshold else "GENUINE"
        
        simple_boxes = [(x, y, w, h) for x, y, w, h, _ in boxes[:5]]
        
        return result, max_score, best_ela, simple_boxes, marked_image
        
    except Exception as e:
        print(f"❌ Error analyzing image: {e}")
        return "ERROR", 0, None, [], None

def check_identity_card(image_path, base_name=None):
    """
    Enhanced ELA verification that saves images to temp directory for API access
    """
    print(f"🔄 Starting ELA verification for: {image_path}")
    
    if not os.path.exists(image_path):
        print("❌ Image file not found")
        return {
            "verdict": "ERROR",
            "score": 0,
            "risk_level": "UNKNOWN",
            "error": "Image file not found",
            "boxes": []
        }
    
    # Run ELA analysis
    result, score, ela_image, boxes, marked_image = detect_tampering_with_boxes(image_path)
    
    if result == "ERROR":
        print("❌ Could not analyze image")
        return {
            "verdict": "ERROR",
            "score": 0,
            "risk_level": "UNKNOWN", 
            "error": "Could not analyze image",
            "boxes": []
        }
    
    # Use provided base_name or extract from image path
    if base_name is None:
        base_name = os.path.splitext(os.path.basename(image_path))[0]
    
    print(f"📁 Using base name: {base_name}")
    
    # Save images to temp directory (same as where uploaded files are stored)
    temp_dir = os.path.join(tempfile.gettempdir(), "sih_uploads")
    os.makedirs(temp_dir, exist_ok=True)
    
    # Generate image file names based on your API expectation
    noise_image_name = f"{base_name}_noise.jpg"
    tampered_image_name = f"{base_name}_tampered.jpg"
    
    noise_path = os.path.join(temp_dir, noise_image_name)
    tampered_path = os.path.join(temp_dir, tampered_image_name)
    
    # Save ELA analysis image (noise image)
    if ela_image is not None:
        cv2.imwrite(noise_path, ela_image)
        print(f"✅ Noise image saved: {noise_path}")
    else:
        print("⚠️ No ELA analysis image to save")
    
    # Save marked image with boxes (tampered regions)
    if marked_image is not None:
        cv2.imwrite(tampered_path, marked_image)
        print(f"✅ Tampered image saved: {tampered_path}")
    else:
        print("⚠️ No marked image to save")
    
    # Determine risk level
    if result == "TAMPERED":
        if score > 25:
            risk_level = "HIGH"
        elif score > 15:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
    else:
        risk_level = "LOW"  # Changed from "NOT TAMPERED" to "LOW" for consistency
    
    print(f"📊 Analysis Results:")
    print(f"   Verdict: {result}")
    print(f"   Score: {score:.2f}")
    print(f"   Risk Level: {risk_level}")
    print(f"   Suspicious Regions: {len(boxes)}")
    
    # Return comprehensive results
    return {
        "verdict": result,
        "score": float(score),
        "risk_level": risk_level,
        "boxes": boxes,
        "suspicious_regions": len(boxes),
        "quality_used": 85,  # Could track the best quality if needed
        "images_generated": {
            "noise_image": noise_image_name if ela_image is not None else None,
            "tampered_image": tampered_image_name if marked_image is not None else None,
            "noise_path": noise_path if ela_image is not None else None,
            "tampered_path": tampered_path if marked_image is not None else None
        }
    }

if __name__ == "__main__":
    # Standalone testing
    image_path = input("Enter path to image: ")
    base_name = input("Enter base name (optional, press Enter to auto-detect): ").strip()
    
    if not base_name:
        base_name = None
    
    result = check_identity_card(image_path, base_name)
    
    print("\n" + "="*50)
    print("FINAL RESULTS:")
    print("="*50)
    for key, value in result.items():
        if key != "images_generated":
            print(f"{key}: {value}")
    
    if "images_generated" in result:
        print("\nGenerated Images:")
        for img_type, img_name in result["images_generated"].items():
            if img_name:
                print(f"  {img_type}: {img_name}")
