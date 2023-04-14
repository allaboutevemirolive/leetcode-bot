// https://leetcode.com/problems/word-ladder/solutions/2425965/idiomatic-rust-solution-with-comments-written-with-the-help-of-copilot/
use std::collections::VecDeque;

struct Solution;

fn main() {
    println!("{:?}",
        Solution::ladder_length("hit".to_string(), "cog".to_string(), vec!["hot".to_string(), "dot".to_string(), "dog".to_string(), "lot".to_string(), "log".to_string(), "cog".to_string()])
    );
}

impl Solution {
    // does a and b differ by exactly one character?    
    pub fn differs_by_one(a: &String, b: &String) -> bool { a.chars().zip(b.chars()).filter(|&(x, y)| x != y).count() == 1 }

    pub fn ladder_length(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {
        // build a graph of all words that differ by one character from the begin word
        // BEGIN build graph

        // vertices of the graph
        // we may need to add the begin word to the graph if it is not in the word list
        let mut nodes = word_list;

        let begin_index =
            match nodes.iter().enumerate().find(|(_, x)| **x == begin_word) {
                Some((i, _)) => i,
                None => { 
                    nodes = [vec![begin_word], nodes].concat(); 
                    0 
                }
            };
        let end_index = 
            match nodes.iter().enumerate().find(|(_, x)| **x == end_word) {
                Some((i, _)) => i,
                None => return 0,
            };

        let neighbors = nodes.iter()
                                .map(|u| nodes.iter().enumerate()
                                                .filter(|(_, v)| Solution::differs_by_one(u, v))
                                                .map(|(i, _)| i)
                                                .collect::<Vec<_>>())
                                .collect::<Vec<Vec<_>>>();

        // END build graph

        // do a breadth first search to from begin_word
        // the depth array keeps track of the depth of the current node
        // if we reach the end_word, we can return the depth
        // BEGIN breadth first search
        let mut depth = vec![None; nodes.len()];
        {
            let mut queue = VecDeque::new();
            let mut visited = vec![false; nodes.len()];

            queue.push_back(begin_index);
            depth[begin_index] = Some(0);
            while !queue.is_empty() {
                let node = queue.pop_front().unwrap();
                if visited[node] {
                    continue;
                }
                visited[node] = true;
                if node == end_index {
                    // return path length = depth of end_word + 1
                    return depth[node].unwrap() + 1;
                }
                for &neighbor in &neighbors[node] {
                    // assign depth
                    if depth[neighbor].is_none() {
                        depth[neighbor] = Some(depth[node].unwrap() + 1);
                    }
                    // should we visit?
                    if !visited[neighbor] {
                        queue.push_back(neighbor);
                    }
                }
            }
        }
        // END breadth first search

        // if we get here, we didn't find a path
        0
    }
}