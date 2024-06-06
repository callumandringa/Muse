#include <Mouse.h>
void setup() {
  Serial.begin(9600);
}

void loop() {
  
  int xValue = analogRead(A1);
  int yValue = analogRead(A2);
  Serial.print(xValue);
  Serial.print(" ^ ");
  Serial.println(yValue);
  
  Mouse.move(xValue, yValue, 0);

  
  
  delay(16); // 
  
}
