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

int speedX = 5;
int speedY = 5;

int inPin1 = 3;
int inPin2 = 5;
int inPin3 = 6;
int inPin4 = 7;

int val1 = 0;
int val2 = 0;
int val3 = 0;
int val4 = 0;

unsigned long prevStateTime = 0;
unsigned long currentTime = 0;
bool prevState = false;


void setup() {
  Mouse.begin();
  pinMode(inPin, INPUT); 
  pinMode(inPin1, INPUT); 
  pinMode(inPin2, INPUT); 
  pinMode(inPin3, INPUT); 
  pinMode(inPin4, INPUT); 
  Serial.begin(9600);
}

void loop() {

   int x = 0, y = 0;

  val = digitalRead(inPin);
  currentTime = micros();
  
  if (val != prevState && currentTime >= prevStateTime + 14500 || val != prevState && currentTime <= prevStateTime - 14500 ) { 
    prevStateTime = currentTime;
    prevState = val;

    if(val == 1){
      Serial.println("click");
      Mouse.click();
    }
  }

  //joystick
  val1 = digitalRead(inPin1); 
  if (val1 == HIGH) { 
    Serial.println("inpin 1");
    y--; 
  }

val2 = digitalRead(inPin2); 
  if (val2 == HIGH) { 
    //Serial.println("inpin 2"); 
    y++;
  }

  val3 = digitalRead(inPin3); 
  if (val3 == HIGH) { 
    //Serial.println("inpin 3"); 
    x--;
  }

val4= digitalRead(inPin4); 
  if (val4 == HIGH) { 
    //Serial.println("inpin 4"); 
    x++;
  }
  
  Mouse.move(x * speedX, y * speedY, 0);
 delay(responseDelay);
//delay(500);
}
