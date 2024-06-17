
int inPin = 2; 
int val = 0; 

void setup() {
  pinMode(inPin, INPUT); 
  Serial.begin(9600);
}

void loop() {
  val = digitalRead(inPin); 
  if (val == HIGH) { 
    Serial.println("er is op de knop gedrukt"); 
  } else {
    Serial.println("druk op de knop");
  }

  delay(400); 
}
