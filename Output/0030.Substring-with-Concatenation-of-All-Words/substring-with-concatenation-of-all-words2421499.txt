// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/2421499/rust-without-sliding-window/
use std::collections::HashMap;

impl Solution {
    pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
        //let s1 = s.as_bytes();
        let slen = s.len();
        let wordlen = words[0].len(); // length of each word is guaranteed to be equal
        
        //create a frequency dictionary from words
        let frequency : HashMap<&String, i32> = words.iter().fold(HashMap::new(),
            |mut acc, word| {
                let count = acc.entry(word).or_insert(0);
                *count += 1;
                acc
            }
        );

        //println!("{:?}", frequency);

        // first we will create an array wordbegin
        // such that wordbegin[i] = None if the s[i..] does not contain any word in words
        // otherwise wordbegin[i] = Some(j) where j if s[i..] contains words[j]
        let wordbegin = 
            (0..slen-wordlen+1)
            .map(|i| &s[i..i+wordlen])
            .map(|w| frequency.keys().find(|&&k| w == k))
            .collect::<Vec<_>>();

        //println!("{:?}", wordbegin);

        let bigwordlen = wordlen * words.len();

        let mut result = Vec::new();
        'outer: for start in 0..slen-bigwordlen+1 {
            let mut wordcount = HashMap::new();
            for i in 0..words.len() {
                let word = wordbegin[start + i * wordlen];
                match word {
                    Some(word) => {
                        let count = wordcount.entry(*word).or_insert(0);
                        *count += 1;
                    }
                    None => {
                        continue 'outer;
                    }
                }
            }
            if wordcount == frequency {
                result.push(start as i32);
            }
        }

        result
    }
}

struct Solution;

fn main() {
    println!("{:?}", Solution::find_substring("barfoothefoobarman".to_string(), 
                                        vec!["foo".to_string(), "bar".to_string()]));
    println!("{:?}", Solution::find_substring("wordgoodgoodgoodbestword".to_string(),
                                        vec!["word".to_string(), "good".to_string(),
                                            "best".to_string(), "good".to_string()]));
    println!("{:?}", Solution::find_substring("barfoofoobarthefoobarman".to_string(),
                                        vec!["bar".to_string(),
                                             "foo".to_string(),
                                             "the".to_string()]));
}