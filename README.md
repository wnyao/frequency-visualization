# CP2407_A1
CP2407-Information Visualisation (Assignment 1)

This is a simple web page, which allows a user to choose a file from their computer, and then produces a histogram showing the number of 
occurrences of all alphabetic characters (ignoring case) of the text in the file they chose. This program is done using the RGraph library 
( http://www.rgraph.net/ ) for visualisation.

The page will first loaded with a button which will allow the user to select a file from a standard file selector dialog box. Once the user 
has chosen their file, javascript should count the number of occurrences (frequency) of each alphabetic character, regardless of whether 
that character is uppercase or lowercase. Ignoring any non-alphabetic characters (the site will be able to handle files containing 
non-alphabetic characters) the site will not handle complex file types containing unique formatting, it simply treat the file as a text 
file and process it one character at a time.
