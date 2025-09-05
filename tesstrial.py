import cv2  
import re
import pytesseract

#loads the pic 
img=cv2.imread('tesstrial2.png')

#convert image to grayscale
def grayscale(image):
    return cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)

#this basically converst grayscale image's pixels to a threshold pixel number that we feed it with, helps in cleaning image by converting to binary form
def threshold(image):
    return cv2.adaptiveThreshold(
        image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, 2
    )

#this is for reducing noise in an image
def denoise(image):
    return cv2.medianBlur(image,3)

#this is for reducing noise but keeping the edges of the texts sharp
def bilateralfilter(image):
    return cv2.bilateralFilter(image,9,75,75)

#this makes the pic bigger
def larger(image, scale=2):
     return cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

#code to extract text form the pic
def extractText(image):
    return pytesseract.image_to_string(image)

#this function removes all the extra lines
def cleanText(text):
   return " ".join(text.split())


img=grayscale(img)
img=threshold(img)
img=larger(img)
img=denoise(img)
img=bilateralfilter(img)


text=extractText(img)
print(cleanText(text))


