// https://leetcode.com/problems/integer-to-english-words/solutions/1591510/rust-recursive-helper-function-and-added-support-for-negative-numbers/
impl Solution {
    pub fn number_to_words(num: i32) -> String {
            let mut num_internal = num;
    if num_internal == 0 {
        return String::from("Zero");
    }
    let mut is_neg = false;
    if num_internal < 0 {
        num_internal = num_internal * -1;
        is_neg = true;
    }

    let scales = ["", "Thousand", "Million", "Billion", "Trillion"];

    let mut i = 0;
    let mut words: String = String::from("");

    while num_internal > 0 {
        if num_internal % 1000 != 0 {
            words = num_helper(num_internal % 1000) + scales[i] + " " + &words[..];
        }
        num_internal /= 1000;
        i += 1;
    }

    if is_neg {
        words = String::from("negative ") + &words[..]
    }
    String::from(words.trim())
    }
}



fn num_helper(num: i32) -> String {
    let units = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];

    let tens = [
        "", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];
    if num == 0 {
        String::from("")
    } else if num < 20 {
        String::from(units[num as usize]) + " "
    } else if num < 100 {
        String::from(tens[(num / 10) as usize]) + " " + num_helper(num % 10).as_str()
    } else {
        String::from(units[(num / 100) as usize]) + " Hundred " + num_helper(num % 100).as_str()
    }
}