// https://leetcode.com/problems/word-search-ii/solutions/1511921/rust-tree/
use std::collections::HashSet;

#[derive(Default)]
struct Tree {
    children: [Option<Box<Tree>>; 26],
    word: Option<String>
}

impl Solution {
    pub fn find_words(board: Vec<Vec<char>>, words: Vec<String>) -> Vec<String> {
        let mut tree: Tree = Default::default();
        
        for word in words.iter() {
            let mut node = &mut tree;
            
            for c in word.as_bytes() {
                node = node.children[(c - b'a') as usize].get_or_insert(Box::new(Default::default()));
            }
            
            node.word = Some(word.clone());
        }
        let mut result: HashSet<String> = HashSet::new();
        
        for i in 0..board.len() {
            for j in 0..board[0].len() {
                let mut visited: Vec<Vec<bool>> = vec![vec![false; board[0].len()]; board.len()];
                Solution::dfs(&board, (i, j), &tree, &mut result, &mut visited);
            }
        }
        
        return result.into_iter().collect();
    }
    
    fn dfs(
        board: &Vec<Vec<char>>,
        pos: (usize, usize),
        tree: &Tree,
        result: &mut HashSet<String>,
        visited: &mut Vec<Vec<bool>>
    ) {
        if visited[pos.0][pos.1] {
            return;
        }
        visited[pos.0][pos.1] = true;
        
        let c = board[pos.0][pos.1];
        if let Some(node) = &tree.children[(c as u8 - b'a') as usize] {
           if let Some(word) = &node.word {
               result.insert(word.clone());
            }
            
            if pos.0 > 0 {
                Solution::dfs(board, (pos.0 - 1, pos.1), &node, result, visited);
            }
            if pos.0 < board.len()-1 {
                Solution::dfs(board, (pos.0 + 1, pos.1), &node, result, visited);
            }
            if pos.1 > 0 {
                Solution::dfs(board, (pos.0, pos.1 - 1), &node, result, visited);
            }
            if pos.1 < board[0].len()-1 {
                Solution::dfs(board, (pos.0, pos.1 + 1), &node, result, visited);
            }
        }
        
        visited[pos.0][pos.1] = false;
    }
}