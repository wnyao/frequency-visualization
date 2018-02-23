# Information Visualization on Frequency of Alphabets 
### University:
* James Cook University
### Course:
* CP2407 Information Visualisation
### Author:
* wnyao
### Project Description:
![Sample](https://github.com/wnyao/information_visualization/blob/master/sample_image.png)


This project is a information visualisation that designed to allow user in inputting a file from their computer and generate a histogram showing the number of occurrences on all alphabetical characters (ignoring case) within the input file. This program is done with support of RGraph library ( http://www.rgraph.net/ ) for visualisation.

The loaded page will come with a button which will allow the user to select a file from a standard file selector dialog box. Once user picked his/her file, javascript will count the number of occurrences (frequency) of each alphabetic character, regardless of whether character is uppercase or lowercase, as well as any non-alphabetic characters (the site will be able to handle files containing 
non-alphabetic characters). The site will not handle complex file types containing unique formatting, it simply treat the file as a text 
file and process it for one character at a time.
