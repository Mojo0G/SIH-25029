import os
import cv2
import matplotlib.pyplot as plt
from ultralytics import YOLO

def predict_with_yolo(model, image_path):
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return

    results = model(image_path, conf=0.25, verbose=False)
    result = results[0]
    annotated_image = result.plot()

    if len(result.boxes) > 0:
        print(f"{os.path.basename(image_path)}: CORRECT")
    else:
        print(f"{os.path.basename(image_path)}: WRONG")
    
    print()

    plt.imshow(cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB))
    plt.title(f"Detection: {os.path.basename(image_path)}")
    plt.axis('off')
    plt.show()

if __name__ == "__main__":
    try:
        MODEL_PATH = "best.pt"
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found. Make sure '{MODEL_PATH}' is in the same folder as this script.")
        model = YOLO(MODEL_PATH)
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        exit()

    TEST_DIR = "test_certificates"
    if not os.path.exists(TEST_DIR):
        os.makedirs(TEST_DIR)

    images_to_test = [
        "valid_cert_1.svg.png",
        "valid_cert_2.svg.png",
        "no_logo_cert.jpeg",
        "fake_logo_cert.jpeg"
    ]

    for image_name in images_to_test:
        image_path = os.path.join(TEST_DIR, image_name)
        predict_with_yolo(model, image_path)