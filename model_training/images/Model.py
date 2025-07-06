import cv2
import numpy as np

# Define your class names (must be in the same order as in your training .yaml file)
CLASS_NAMES = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

# Load the ONNX model
# You will get this .onnx file after exporting your trained YOLO model
net = cv2.dnn.readNet("path/to/your/trained_trash_model.onnx")

# Load an image or video frame
image = cv2.imread("path/to/your/test_image.jpg")
image_height, image_width, _ = image.shape

# Prepare the image for the model (create a blob)
blob = cv2.dnn.blobFromImage(image, 1/255.0, (640, 640), swapRB=True, crop=False)
net.setInput(blob)

# Perform a forward pass and get the raw output
outputs = net.forward()

# Process the output to get bounding boxes, confidences, and class IDs
boxes = []
confidences = []
class_ids = []

# The output from a YOLOv8 model has a different shape, let's process it
output_data = outputs[0]
rows = output_data.shape[0]

# The output needs to be transposed to be processed correctly
output_data = output_data.T

# First 4 values are bounding box, the rest are class scores
for i in range(rows):
    row = output_data[i]
    confidence = row[4] # Confidence of detection

    if confidence > 0.5: # Filter out weak detections
        scores = row[5:]
        class_id = np.argmax(scores)
        
        # We also need to check the confidence of the class prediction
        if scores[class_id] > 0.25:
            confidences.append(confidence)
            class_ids.append(class_id)
            
            # Get bounding box coordinates and scale them to the original image size
            x, y, w, h = row[0], row[1], row[2], row[3]
            
            left = int((x - w / 2))
            top = int((y - h / 2))
            width = int(w)
            height = int(h)
            
            box = np.array([left, top, width, height])
            boxes.append(box)

# Apply Non-Max Suppression to remove overlapping bounding boxes
indices = cv2.dnn.NMSBoxes(boxes, np.array(confidences), 0.5, 0.4)

if len(indices) > 0:
    for i in indices.flatten():
        x, y, w, h = boxes[i]
        label = str(CLASS_NAMES[class_ids[i]])
        confidence = confidences[i]
        
        # Draw bounding box and label
        color = (0, 255, 0) # Green
        cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)
        cv2.putText(image, f"{label}: {confidence:.2f}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)


cv2.imshow("Trash Detection", image)
cv2.waitKey(0)
cv2.destroyAllWindows()