# gesture_recognition.py
import cv2
import mediapipe as mp
import time
import math

class GestureRecognizer:
    def __init__(self):
        """Initialize the gesture recognition system"""
        # Initialize MediaPipe Hands
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,  # Tracking one hand is sufficient
            min_detection_confidence=0.7,  # High confidence threshold for reliability
            min_tracking_confidence=0.6    # Good tracking confidence
        )
        self.mp_draw = mp.solutions.drawing_utils
        
    def detect_gestures(self, callback_function):
        """Main gesture detection loop with callback for detected gestures"""
        # Initialize camera
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open camera.")
            return False
        
        print("Gesture recognition started. Show gestures to interact.")
        print("- Open palm (5 fingers): Start conversation")
        print("- Index finger only: Topic 1 (Weather, News)")
        print("- Index + Middle fingers: Topic 2 (Cooking Tips)")
        print("- Middle + Ring + Little fingers: Topic 3 (Stories)")
        print("- Index + Middle + Ring + Little fingers: Topic 4 (Fun)")
        print("- Closed fist: Exit gesture mode")
        
        # For tracking consistent gestures
        last_gesture = None
        gesture_start_time = 0
        gesture_confirmed = False
        
        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    print("Failed to capture frame from camera")
                    break
                
                # Mirror the frame horizontally for a more intuitive interaction
                frame = cv2.flip(frame, 1)
                
                # Convert BGR to RGB
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Process the frame for hand landmarks
                results = self.hands.process(rgb_frame)
                
                # Draw hand landmarks if detected
                if results.multi_hand_landmarks:
                    for hand_landmarks in results.multi_hand_landmarks:
                        self.mp_draw.draw_landmarks(
                            frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)
                        
                        # Identify the gesture
                        gesture = self.identify_gesture(hand_landmarks.landmark)
                        
                        # Display the identified gesture
                        if gesture:
                            cv2.putText(frame, f"Detected: {gesture}", (10, 50), 
                                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                        
                        # Check for gesture consistency (held for 1.5 seconds)
                        current_time = time.time()
                        if gesture:
                            if gesture != last_gesture:
                                last_gesture = gesture
                                gesture_start_time = current_time
                                gesture_confirmed = False
                            elif current_time - gesture_start_time > 1.5 and not gesture_confirmed:
                                print(f"Gesture confirmed: {gesture}")
                                gesture_confirmed = True
                                
                                # Call the callback function with the confirmed gesture
                                callback_function(gesture)
                                
                                # Reset after processing
                                gesture_start_time = current_time
                else:
                    last_gesture = None
                
                # Display instructions on the frame
                cv2.putText(frame, "Gesture Recognition Active", (10, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)
                
                # Display the frame
                cv2.imshow('Gesture Recognition', frame)
                
                # Exit on ESC key
                if cv2.waitKey(5) & 0xFF == 27:
                    break
                
                # Also exit if a closed_fist is confirmed
                if gesture_confirmed and last_gesture == "closed_fist":
                    break
        
        except Exception as e:
            print(f"Error in gesture recognition: {e}")
        finally:
            # Clean up
            cap.release()
            cv2.destroyAllWindows()
    
    def identify_gesture(self, landmarks):
        """Identify specific gestures based on finger positions"""
        # Get fingertip and base landmarks for each finger
        thumb_tip = landmarks[4]
        index_tip = landmarks[8]
        middle_tip = landmarks[12]
        ring_tip = landmarks[16]
        pinky_tip = landmarks[20]
        
        # Get palm landmarks for reference
        wrist = landmarks[0]
        
        # Check if each finger is extended
        thumb_extended = self._is_thumb_extended(landmarks)
        index_extended = self._is_finger_extended(index_tip, landmarks[6], landmarks[5])
        middle_extended = self._is_finger_extended(middle_tip, landmarks[10], landmarks[9])
        ring_extended = self._is_finger_extended(ring_tip, landmarks[14], landmarks[13])
        pinky_extended = self._is_finger_extended(pinky_tip, landmarks[18], landmarks[17])
        
        # Create finger state array for easy pattern matching
        fingers_extended = [thumb_extended, index_extended, middle_extended, ring_extended, pinky_extended]
        
        # Check for open palm (all fingers extended) - Start conversation
        if all(fingers_extended):
            return "open_palm"
        
        # Check for index finger only - Topic 1: Weather, News
        elif index_extended and not middle_extended and not ring_extended and not pinky_extended:
            return "topic_1"
        
        # Check for index and middle fingers - Topic 2: Cooking Tips
        elif index_extended and middle_extended and not ring_extended and not pinky_extended:
            return "topic_2"
        
        # Check for middle, ring, and little fingers - Topic 3: Stories
        elif not index_extended and middle_extended and ring_extended and pinky_extended:
            return "topic_3"
        
        # Check for index, middle, ring, and little fingers - Topic 4: Fun Talking
        elif index_extended and middle_extended and ring_extended and pinky_extended and not thumb_extended:
            return "topic_4"
        
        # Check for closed fist (no fingers extended) - Exit gesture mode
        elif not any(fingers_extended):
            return "closed_fist"
        
        # No recognized gesture
        return None
    
    def _is_finger_extended(self, fingertip, pip, mcp):
        """Check if a finger is extended by comparing y-coordinates"""
        # A finger is extended if its tip is higher (smaller y-value) than its base
        return fingertip.y < pip.y
    
    def _is_thumb_extended(self, landmarks):
        """Special case for thumb extension detection"""
        thumb_tip = landmarks[4]
        thumb_ip = landmarks[3]
        thumb_mcp = landmarks[2]
        
        # For thumb, we check if it's extended to the side based on x-coordinate
        return thumb_tip.x < thumb_mcp.x if landmarks[0].x < landmarks[5].x else thumb_tip.x > thumb_mcp.x

    def calculate_palm_normal(self, landmarks):
        """Calculate palm normal vector using cross product of palm diagonals"""
        # Get key landmarks
        p1 = landmarks[0]  # wrist
        p2 = landmarks[5]  # Index finger MCP
        p3 = landmarks[17]  # Pinky MCP
        
        # Calculate vectors
        v1 = [p2.x - p1.x, p2.y - p1.y, p2.z - p1.z]
        v2 = [p3.x - p1.x, p3.y - p1.y, p3.z - p1.z]
        
        # Cross product to get normal vector
        normal = [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ]
        
        # Normalize normal vector
        normal_norm = math.sqrt(sum([x*x for x in normal]))
        if normal_norm > 0:
            normal = [x / normal_norm for x in normal]
        
        return normal
    



def handle_gesture(gesture):
    print(f"🔥 Action triggered for: {gesture}")
    if gesture == "open_palm":
        print("💬 Starting conversation...")
    elif gesture == "topic_1":
        print("☁️ Topic 1: Weather, News")
    elif gesture == "topic_2":
        print("🍳 Topic 2: Cooking Tips")
    elif gesture == "topic_3":
        print("📖 Topic 3: Stories")
    elif gesture == "topic_4":
        print("🎉 Topic 4: Fun Talking")
    elif gesture == "closed_fist":
        print("🛑 Exiting gesture mode.")

# Create an instance of the recognizer

gr = GestureRecognizer()

gr.detect_gestures(handle_gesture)
