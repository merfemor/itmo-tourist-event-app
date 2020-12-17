# How to run

If build and run in Intellij IDEA, add `-parameter` as additional parameter to javac. 
It is needed for correct Jackson library work.

To run app execute
```
./gradlew bootRun
```

To run tests execute
```
./gradlew test
```

# How to build jar

Common way is to run
```
./gradlew build # [ -x tests ] optional for skip unit tests
```
If jar file not created, try manually
```
./gradlew bootJar
```

