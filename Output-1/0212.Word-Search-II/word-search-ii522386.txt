// https://leetcode.com/problems/word-search-ii/solutions/522386/rust-trienode/
use std::collections::HashMap;

#[derive(Debug)]
struct TrieNode {
    next: HashMap<char, TrieNode>,
    word: Option<String>,
}

impl Solution {
    pub fn find_words(board: Vec<Vec<char>>, words: Vec<String>) -> Vec<String> {
        let mut trie: TrieNode = Self::init_trie(words);
                
        let mut res: Vec<String> = vec![];
        let mut board = board.clone();
        
        for i in 0..board.len() {
            for j in 0..board[0].len() {
                Self::dfs(&mut board, i, j, &mut trie, &mut res);    
            }
        }
        
        res
    }
    
    fn dfs(
        mut board: &mut Vec<Vec<char>>, 
        i: usize, 
        j: usize, 
        mut trie: &mut TrieNode, 
        mut res: &mut Vec<String>, 
    ) {   
        
        let c = board[i][j];
        
        if c == '#' { return; }
        
        let mut next = &mut trie.next;
        if !next.contains_key(&c) { return; }
        
        let mut next_trie =next.get_mut(&c).unwrap();
        if let Some(word) = &next_trie.word {
            res.push(word.to_string());
            next_trie.word = None;
        }
        
        board[i][j] = '#';
        
        if i > 0                  { Self::dfs(&mut board, i-1, j, &mut next_trie, &mut res); }
        if j > 0                  { Self::dfs(&mut board, i, j-1, &mut next_trie, &mut res); }
        if i < board.len() - 1    { Self::dfs(&mut board, i+1, j, &mut next_trie, &mut res); }
        if j < board[0].len() - 1 { Self::dfs(&mut board, i, j+1, &mut next_trie, &mut res); }
        
        board[i][j] = c;
    }
    
    fn init_trie(words: Vec<String>) -> TrieNode {
        let mut node = TrieNode {
            next: HashMap::new(),
            word: None
        };
        
        for word in words {
            let mut n = &mut node;
            
            for c in word.chars() {
                n = n.next.entry(c).or_insert(
                    TrieNode {
                        next: HashMap::new(),
                        word: None
                    }
                );
            }
            
            n.word = Some(word);
        }
        
        node
    }
}