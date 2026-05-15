import sys
import subprocess

while True:
    name = input("\nWhat's your name? ")

    words = name.split()

    print("\nHello,", name)
    print("Uppercase:", name.upper())
    print("Reversed:", name[::-1])
    print("Word count:", len(words))

    initials = "".join(word[0].upper() for word in words)
    print("Initials:", initials)

    again = input("\nRun again? (y/n) ").lower().strip()

    if again != "y":
        print("\nLaunching Python REPL... bye!")
        break

subprocess.run([sys.executable])
