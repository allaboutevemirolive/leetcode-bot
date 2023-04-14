// https://leetcode.com/problems/word-ladder-ii/solutions/2425929/idiomatic-rust-with-lots-of-comments-written-with-the-help-of-copilot/
use std::collections::VecDeque;

struct Solution;

fn main() {
    println!("{:?}",
        Solution::find_ladders("hit".to_string(), "cog".to_string(), vec!["hot".to_string(), "dot".to_string(), "dog".to_string(), "lot".to_string(), "log".to_string(), "cog".to_string()])
    );
}

impl Solution {

    // does a and b differ by exactly one character?    
    pub fn differs_by_one(a: &String, b: &String) -> bool { a.chars().zip(b.chars()).filter(|&(x, y)| x != y).count() == 1 }

    pub fn find_ladders(begin_word: String, end_word: String, word_list: Vec<String>) -> Vec<Vec<String>> {
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
                None => return vec![],
            };

        let neighbors = nodes.iter()
                                .map(|u| nodes.iter().enumerate()
                                                .filter(|(_, v)| Solution::differs_by_one(u, v))
                                                .map(|(i, _)| i)
                                                .collect::<Vec<_>>())
                                .collect::<Vec<Vec<_>>>();

        // END build graph


        // do a breadth first search to find all paths from begin_word to end_word
        // the most important outcome is the parent array
        // which keeps track of the BFS tree
        // BEGIN breadth first search
        let mut parent = vec![vec![]; nodes.len()];
        {
            let mut queue = VecDeque::new();
            let mut depth = vec![None; nodes.len()];
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
                    break;
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
                    // is this a child?
                    if depth[neighbor].unwrap() == depth[node].unwrap() + 1 {
                        parent[neighbor].push(node);
                    }
                }
            }
        }
        // END breadth first search


        // trace back parent pointers to find all paths from begin_word to end_word
        // BEGIN trace back
        if parent[end_index].is_empty() {
            return vec![];
        }
        let mut paths_final = vec![];
        {
            let mut paths_curr = vec![vec![end_index]];
            loop {
                // if paths_curr is empty, we're done
                if paths_curr.is_empty() {
                    break;
                }
                let mut paths_next = vec![];
                // for each path in paths_curr, 
                // enhance each path with their parent and put the new paths to paths_next
                for path in paths_curr.into_iter() {
                    // if the item at the beginning is the end_word,
                    // we're done with this path
                    if path[0] == begin_index {
                        paths_final.push(path);
                        continue;
                    } 
                    // otherwise, we get the parents of the item at the beginning
                    // and put the new paths to paths_next
                    for &p in &parent[path[0]] {
                        paths_next.push([vec![p], path.clone()].concat());
                    }
                }
                paths_curr = paths_next;
            }
        }
        // END trace back
        
        
        // convert paths to strings
        paths_final.into_iter()
                    .map(|path| path.into_iter()
                                    .map(|i| nodes[i].clone())
                                    .collect::<Vec<_>>())
                    .collect::<Vec<_>>()
    }

}