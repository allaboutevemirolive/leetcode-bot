// https://leetcode.com/problems/word-ladder/solutions/1764786/rust-beats-100/
use std::collections::{HashMap,HashSet};
impl Solution {
    pub fn ordi(c: u8, i: usize) -> u64 {
        ((c-b'a'+1) as u64) << (i*6)
    }
    pub fn ladder_length(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {
        let (begin,end) = (begin_word.as_bytes(),end_word.as_bytes());
        let mut u8_list: Vec<&[u8]> = word_list.iter()
            .map(|w| w.as_bytes()).collect();
        u8_list.push(begin);
        let mut conn = HashMap::<u64,Vec<&[u8]>>::new();
        for w in u8_list.into_iter() {
            let h = w.iter().enumerate()
                .fold(0, |acc, (i,&c)|
                  acc ^ Solution::ordi(c,i)
                );
            for (i,&c) in w.iter().enumerate(){
                let h2 = h ^ Solution::ordi(c,i);
                conn.entry(h2).or_insert_with(|| vec![]).push(w);
            }
        }
        let mut g = HashMap::<&[u8],Vec<&[u8]>>::new();
        for bag in conn.values() {
            if bag.len() == 1 { continue }
            for &w in bag.iter() {
                for &o in bag.iter() {
                    if o != w {
                        g.entry(w).or_insert_with(|| vec![]).push(o);
                        g.entry(o).or_insert_with(|| vec![]).push(w);
                    }
                }
            }
        }
        let mut q = vec![begin];
        let mut seen: HashSet<&[u8]> = HashSet::from([begin]);

        for dist in 2..99999 {
            if q.is_empty() { break }
            let mut q2 = vec![];
            for w in q.into_iter() {
                for &o in g.get(w).unwrap_or(&vec![]).iter() {
                    if !seen.contains(o) {
                        if o == end { return dist; }
                        seen.insert(o);
                        q2.push(o);
                    }
                }
            }
            q = q2;
        }

        0
    }
}