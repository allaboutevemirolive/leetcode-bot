// https://leetcode.com/problems/word-search-ii/solutions/2780513/rust-hashset-hashmap-backtracking/
use std::collections::{HashMap, HashSet};

const DIR: [i32; 5] = [0, 1, 0, -1, 0];

impl Solution {
    pub fn find_words(board: Vec<Vec<char>>, words: Vec<String>) -> Vec<String> {
        let mut prefix: HashMap<&str, i32> = HashMap::new();
        for w in words.iter() {
            for i in 1..w.len() {
                *prefix.entry(&w[..i]).or_insert(0) += 1;
            }
        }
        let mut whole: HashSet<&str> = words.iter().map(|w| w.as_str()).collect();
        let mut visited: Vec<Vec<bool>> = vec![vec![false; board[0].len()]; board.len()];
        let mut ans = Vec::new();
        for i in 0..board.len() {
            for j in 0..board[0].len() {
                Self::backtrack(i, j, &mut String::new(), &mut ans,
                    &mut prefix, &mut whole, &mut visited, &board);
            }
        }
        ans
    }

    fn backtrack(
    i: usize,
    j: usize,
    curr: &mut String,
    ans: &mut Vec<String>,
    prefix: &mut HashMap<&str, i32>,
    whole: &mut HashSet<&str>,
    visited: &mut Vec<Vec<bool>>,
    board: &Vec<Vec<char>>) -> i32 {
        curr.push(board[i][j]);
        visited[i][j] = true;
        let mut found = 0;
        if whole.contains(curr.as_str()) {
            whole.remove(curr.as_str());
            ans.push(curr.clone());
            found += 1;
        }
        if prefix.get(curr.as_str()).is_some() {
            for d in 0..4 {
                let i2 = i as i32 + DIR[d];
                let j2 = j as i32 + DIR[d + 1];
                if i2 >= 0 && i2 < board.len() as i32
                && j2 >= 0 && j2 < board[0].len() as i32
                && !visited[i2 as usize][j2 as usize] {
                    let res = Self::backtrack(i2 as usize, j2 as usize, curr, ans,
                        prefix, whole, visited, board);
                    found += res;
                    if prefix.get(curr.as_str()) == Some(&res) {
                        prefix.remove(curr.as_str());
                        break;
                    }
                    else {
                        *prefix.get_mut(curr.as_str()).unwrap() -= res;
                    }
                }
            }
        }
        curr.pop();
        visited[i][j] = false;
        found
    }
}