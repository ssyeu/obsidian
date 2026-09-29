[[comp sci]]
Set is a data type that can't have duplicates! Useful thing to know. Can check len of a set vs the original to see if there are duplicates.
Missing number: given a set between 0 and n find the missing number. Clever solution, you can add the list of number together and compare the expected sum, the difference is the number. This is neat! 

Find all missing numbers: same as last problem but with multiple missing numbers and duplicates. We can make a set to get every unique number and check if set(x) + 1 = set(x+1) and if it doesn't, (x) + 1 would be a missing number. Ah he uses the length of the set to see what the max number would be. for i in range (1, len(nums) + 1): and he adds the missing numbers to a diff set.

Two Sum: we could go through each number individually and find the sum and see if it's a target. We can also subtract a number from the target and check the list for that num. He talks about hashmaps but I hve no clue what he is talking about.

List's are a data type that is a list, duh, use it to keep a list of things, they can keep duplicates. Remember that sets don't contain duplicates!
Check to see if there are elements you already added to a list before you check its length, the things already added will affect what number you have to loop a program because there is already some elements in there, you will need to loop less.

How many numbers smaller than current number: if we do a sorted list we could just check len of nums in front of it to see how many are smaller. Enumerate gives an index and value, we can sort the list, use enumerate to find the value and index and the index will be the number of numbers in front of it. We add it to a set so same values get the same answer. Then we look through the original nums and compare it with the dic and put it in an ar