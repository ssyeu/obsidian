[[comp sci]]
Set is a data type that can't hve duplicates! Useful thing to know. Can check len of a set vs the original to see if there are duplicates.
Missing number: given a set between 0 and n find the missing number. Clever solution, you can add the list of number together and compare the expected sum, the difference is the number. This is neat! 
Find all missing numbers: same as last problem but with multiple missing numbers and duplicates. We can make a set to get every unique number and check if set(x) + 1 = set(x+1)