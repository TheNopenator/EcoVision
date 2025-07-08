# CV Model Training Pipeline
# This script implements a complete pipeline for training a computer vision model
# using a list of image hyperlinks. It covers data downloading, preprocessing,
# model definition, training, and evaluation.

# --- 1. Import Necessary Libraries ---
import os
import random
import numpy as np
import requests
from PIL import Image
from io import BytesIO
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Flatten, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# --- 2. Configuration and Setup ---
# List of 4000 hyperlinks (using placeholders for brevity)
# In a real scenario, this list would be populated with actual URLs.
# For demonstration, we'll generate dummy image data.
NUM_IMAGES = 4000
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
NUM_CLASSES = 10 # Example: 10 different categories of images
DATA_DIR = "cv_data"
IMAGES_DIR = os.path.join(DATA_DIR, "images")

# Create directories if they don't exist
os.makedirs(IMAGES_DIR, exist_ok=True)

# --- 3. Data Simulation (in place of downloading 4000 hyperlinks) ---
# In a real-world application, you would use the function below to download images.
# To make this script runnable without 4000 actual links, we'll simulate the data.

def download_images_from_hyperlinks(hyperlinks, save_dir):
    """
    Downloads images from a list of hyperlinks and saves them.
    Args:
        hyperlinks (list): A list of URLs to the images.
        save_dir (str): The directory where images will be saved.
    """
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    
    for i, url in enumerate(hyperlinks):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status() # Raise an exception for bad status codes
            img = Image.open(BytesIO(response.content))
            img = img.convert("RGB") # Ensure image is in RGB format
            img.save(os.path.join(save_dir, f"image_{i}.png"))
            print(f"Successfully downloaded image {i+1}/{len(hyperlinks)}")
        except requests.exceptions.RequestException as e:
            print(f"Error downloading {url}: {e}")
        except IOError as e:
            print(f"Error processing image from {url}: {e}")

def simulate_image_data(num_images, num_classes, save_dir):
    """
    Generates and saves dummy images for demonstration purposes.
    """
    print("Simulating image data...")
    for i in range(num_images):
        # Create a random image
        random_image_array = np.random.randint(0, 256, size=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3), dtype=np.uint8)
        img = Image.fromarray(random_image_array, 'RGB')
        
        # Assign a random class and save it in a corresponding folder
        class_label = f"class_{random.randint(0, num_classes - 1)}"
        class_dir = os.path.join(save_dir, class_label)
        os.makedirs(class_dir, exist_ok=True)
        
        img.save(os.path.join(class_dir, f"sim_image_{i}.png"))
    print(f"Successfully generated {num_images} dummy images in {num_classes} classes.")

# To run this script without actual hyperlinks, we call the simulation function.
# If you have a list of hyperlinks, replace this call with the download_images_from_hyperlinks function.
# hyperlinks = ["http://example.com/image1.jpg", "http://example.com/image2.jpg", ...]
# download_images_from_hyperlinks(hyperlinks, IMAGES_DIR)
simulate_image_data(NUM_IMAGES, NUM_CLASSES, IMAGES_DIR)


# --- 4. Data Preprocessing and Augmentation ---
# We use ImageDataGenerator to load images from directories, preprocess them,
# and apply data augmentation to improve model generalization.

# Create data generators for training and validation
datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2 # Use 20% of the data for validation
)

train_generator = datagen.flow_from_directory(
    IMAGES_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training' # Set as training data
)

validation_generator = datagen.flow_from_directory(
    IMAGES_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation' # Set as validation data
)

# --- 5. Model Definition (Transfer Learning) ---
# We use a pre-trained VGG16 model as a base and add custom classification layers on top.
# This technique, called transfer learning, leverages knowledge from a model trained on a large dataset.

# Load the VGG16 model, pre-trained on ImageNet, without the top classification layers
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3))

# Freeze the layers of the base model so they are not updated during training
for layer in base_model.layers:
    layer.trainable = False

# Add our custom layers on top of the base model
x = base_model.output
x = Flatten()(x)
x = Dense(512, activation='relu')(x)
x = Dropout(0.5)(x)
predictions = Dense(NUM_CLASSES, activation='softmax')(x)

# Create the final model
model = Model(inputs=base_model.input, outputs=predictions)

# --- 6. Model Compilation ---
# We configure the model for training by specifying the optimizer, loss function, and metrics.
model.compile(optimizer=Adam(learning_rate=0.0001),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Print a summary of the model architecture
model.summary()

# --- 7. Model Training ---
# We train the model using the data generators.
print("\n--- Starting Model Training ---")
history = model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // BATCH_SIZE,
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // BATCH_SIZE,
    epochs=EPOCHS
)
print("--- Model Training Finished ---\n")


# --- 8. Model Evaluation ---
# We evaluate the trained model on the validation set to see its performance.
print("--- Evaluating Model ---")
loss, accuracy = model.evaluate(validation_generator)
print(f"Validation Loss: {loss:.4f}")
print(f"Validation Accuracy: {accuracy:.4f}")

# --- 9. Save the Model ---
# Save the trained model for future use.
model.save(os.path.join(DATA_DIR, "image_classifier_model.h5"))
print(f"Model saved to {os.path.join(DATA_DIR, 'image_classifier_model.h5')}")

# --- 10. Example Prediction (Optional) ---
# You can use this section to test the model on a new image.
def predict_image(model, img_path):
    img = Image.open(img_path).resize(IMAGE_SIZE)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
    
    prediction = model.predict(img_array)
    class_indices = train_generator.class_indices
    class_labels = list(class_indices.keys())
    predicted_class = class_labels[np.argmax(prediction)]
    
    print(f"The model predicts the image is: {predicted_class}")

# Find a sample image from our simulated data to test prediction
try:
    first_class_dir = os.path.join(IMAGES_DIR, os.listdir(IMAGES_DIR)[0])
    sample_image_path = os.path.join(first_class_dir, os.listdir(first_class_dir)[0])
    print("\n--- Running an example prediction ---")
    predict_image(model, sample_image_path)
except (FileNotFoundError, IndexError):
    print("\nCould not find a sample image for prediction.")


