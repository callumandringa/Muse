#include <Mouse.h>

const int xAxis = A1;
const int yAxis = A2;

int range = 6;
int responseDelay = 10;
int threshold = range / 4;
int center = range / 2;
int minima[] = {1023, 1023};
int maxima[] = {0, 0};
int axis[] = {xAxis, yAxis};
int mouseReading[2];

int inPin = 2; 
int val = 0;

void setup() {
  Mouse.begin();
  pinMode(inPin, INPUT); 
  Serial.begin(9600);
}

void loop() {
  int xReading = readAxis(0);
  int yReading = readAxis(1);
  Mouse.move(xReading, yReading, 0);

  val = digitalRead(inPin); 
  if (val == HIGH) { 
    Serial.println("er is op de knop gedrukt"); 
    Mouse.click();
  } else {
    Serial.println("druk op de knop");
  }
  
  delay(responseDelay);
}

int readAxis(int axisNumber) {
  int distance = 0;
  int reading = analogRead(axis[axisNumber]);
  if (reading < minima[axisNumber]) {
    minima[axisNumber] = reading;
  }
  if (reading > maxima[axisNumber]) {
    maxima[axisNumber] = reading;
  }
  reading = map(reading, minima[axisNumber], maxima[axisNumber], 0, range);
  if (abs(reading - center) > threshold) {
    distance = (reading - center);
  }
  if (axisNumber == 1) {
    distance = -distance;
  }
  return distance;
}
