// https://leetcode.com/problems/palindrome-pairs/solutions/1269909/rust-hashmap-solution-48ms/
use std::collections::HashMap;

impl Solution {
    pub fn palindrome_pairs(words: Vec<String>) -> Vec<Vec<i32>> {
        let hm = words
            .iter()
            .enumerate()
            .map(|(i, word)| (word.clone(), i))
            .collect::<HashMap<_, _>>();
        let mut answer = Vec::new();
        for (i, word) in words.iter().enumerate() {
            if let Some(&j) = hm.get(&word.chars().rev().collect::<String>()) {
                if i != j {
                    answer.push([i as i32, j as i32].to_vec());
                }
            }
            {
                let w = word.chars().rev().collect::<Vec<_>>();
                for k in 0..w.len() {
                    if (0..=k / 2).all(|l| w[l] == w[k - l]) {
                        if let Some(&j) = hm.get(&w[k + 1..].iter().collect::<String>()) {
                            answer.push([i as i32, j as i32].to_vec());
                        }
                    }
                }
            }
            {
                let w = word.chars().collect::<Vec<_>>();
                for k in 0..w.len() {
                    if (0..=k / 2).all(|l| w[l] == w[k - l]) {
                        if let Some(&j) = hm.get(&w[k + 1..].iter().rev().collect::<String>()) {
                            answer.push([j as i32, i as i32].to_vec());
                        }
                    }
                }
            }
        }
        answer
    }
}