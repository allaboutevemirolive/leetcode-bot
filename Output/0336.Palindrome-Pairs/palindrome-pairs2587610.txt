// https://leetcode.com/problems/palindrome-pairs/solutions/2587610/rust-trie-solution/
use std::collections::HashMap;

struct Trie {
    children: HashMap<char, Trie>,
    indx: Vec<i32>,
    word: i32
}

impl Trie {
    fn new() -> Self {
        Self { children: HashMap::new(), indx: vec![], word: -1 }
    }
    
    fn build(&mut self, words: &Vec<Vec<char>>, empty: &mut i32) {
        let n = words.len();
        
        for i in 0..n {
            if words[i].len() == 0 {
                *empty = i as i32;
                continue
            }
            
            let mut node = &mut *self;
            for c in &words[i] {
                node = node.children.entry(*c).or_insert(Trie::new());
                node.indx.push(i as i32);
            }
            
            node.word = i as i32;
        }
    }
    
    fn palindromic(data: &Vec<char>, start: usize, end: usize) -> bool {
        for i in 0..end - start {
            if start + i >= end - 1 - i { break }
            if data[start + i] != data[end - 1 - i] { return false }
        }
        true
    } 
    
    fn calculate(&self, words: &Vec<Vec<char>>, empty: i32) -> Vec<Vec<i32>> {
        let n = words.len();
        let mut ret: Vec<Vec<i32>> = vec![];
        
        if empty != -1 {
            for i in 0..n {
                if i as i32 == empty { continue }
                if Self::palindromic(&words[i], 0, words[i].len()) == false { continue }
                ret.push(vec![empty, i as i32]);
                ret.push(vec![i as i32, empty]);
            } 
        }
        
        for i in 0..n {
            let mut node = self;
            let m = words[i].len();
            
            for j in (0..m).rev() {
                let c = words[i][j];
                if node.children.contains_key(&c) == false { break }
                
                node = node.children.get(&c).unwrap();
                if node.word != -1 && node.word != i as i32 {
                    if Self::palindromic(&words[i], 0, j) {
                        ret.push(vec![node.word, i as i32]);
                    }
                }
                if j == 0 {
                    for k in &node.indx {
                        let k = *k as usize;
                        if k == i || k as i32 == node.word { continue }
                        if Self::palindromic(&words[k], m, words[k].len()) == false { continue }
                        ret.push(vec![k as i32, i as i32]);
                    }
                }
            }
        }
        ret
    }
}


impl Solution {
    pub fn palindrome_pairs(words: Vec<String>) -> Vec<Vec<i32>> {
        let mut trie = Trie::new();
        let mut empty = -1;
        let words: Vec<Vec<char>> = words.iter().map(|w| w.chars().collect::<Vec<char>>()).collect();
        
        trie.build(&words, &mut empty);
        trie.calculate(&words, empty)
    }
}