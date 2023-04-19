// https://leetcode.com/problems/palindrome-partitioning-ii/solutions/386752/a-rust-bfs-soution/
/// A BFS solution
/// 1. Find all palindrome start from every index and construct a path tree from first index.
/// For example, from "aabb" we can get
///                       0
///                     /  \
///         2 (skip "aa")   4 (skip "aabb")    and  1 (skip "a")
///        / \             / \                     / \
///      ...             ...                      ...
/// 2. Iterate this tree by BFS until reaching last index and return current level of tree
pub struct Solution {}

// submission codes start here
use std::collections::{VecDeque, HashSet};

impl Solution {
    pub fn min_cut(s: String) -> i32 {
        if s.len() == 0 {
            return 0;
        }
        let cs: Vec<char> = s.chars().collect();

        // construct palindrome tree

        // storage all palindrome len at every index
        let mut pals: Vec<Vec<usize>> = (0..s.len()).map(|_| { vec![1] }).collect();
        let len = cs.len() as i32;

        // iterate and expand two sides to find all palindrome
        for i in 1..len*2-2 {
            let mut r = 1;
            loop {
                let left_bound = if i % 2 != 0 { i / 2 + 1 - r } else { i / 2 - r };
                let right_bound = i / 2 + r;
                if left_bound < 0 || right_bound >= len || cs[left_bound as usize] != cs[right_bound as usize] {
                    break;
                }
                pals[left_bound as usize].push((right_bound - left_bound + 1) as usize);
                r += 1;
            }
        }

        // BFS
        let mut level = 0;
        let mut queue = vec![0];
        while queue.len() > 0 {
            // use HashSet to remove duplicate
            let mut new_queue = HashSet::new();
            for i in queue {
                let pls = &pals[i];
                for &pl in pls {
                    // once reaching end of string, return current tree level
                    if i + pl >= cs.len() {
                        return level;
                    }
                    new_queue.insert(i + pl);
                }
            }
            queue = new_queue.into_iter().collect();
            level += 1;
        }
        0
    }
}