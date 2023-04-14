// https://leetcode.com/problems/edit-distance/solutions/2035214/rust-top-down-and-bottom-up-dp/
fn recurse(word1: &Vec<u8>, word2: &Vec<u8>, first_idx: usize, second_idx: usize, memo: &mut Vec<Vec<i32>>) -> i32 {
    
    if first_idx == word1.len() {
        return (word2.len() - second_idx) as i32;
    } else if second_idx == word2.len() {
        return (word1.len() - first_idx) as i32
    }

    if memo[first_idx][second_idx] > -1 {
        return memo[first_idx][second_idx];
    }

    // Both words have the same letter - continue
    if word1[first_idx] == word2[second_idx] {
        let res = recurse(word1, word2, first_idx+1, second_idx+1, memo);
        memo[first_idx][second_idx] = res;
        return res;
    }

    let mut min_dist = i32::MAX;
    // remove current letter
    if first_idx < word1.len() {
        min_dist = min_dist.min(1+recurse(word1, word2, first_idx+1, second_idx, memo));
    }

    // replace current letter
    if first_idx < word1.len() && second_idx < word2.len() {
        min_dist = min_dist.min(1+recurse(word1, word2, first_idx+1, second_idx+1, memo));
    }

    // insert letter
    if second_idx < word2.len() {
        min_dist = min_dist.min(1+recurse(word1, word2, first_idx, second_idx+1, memo));
    }

    memo[first_idx][second_idx] = min_dist;
    min_dist
}


impl Solution {
    pub fn min_distance(word1: String, word2: String) -> i32 {
        let mut memo = vec![vec![-1; word2.len()]; word1.len()];
        recurse(&word1.into_bytes(), &word2.into_bytes(), 0, 0, &mut memo)
    }
}