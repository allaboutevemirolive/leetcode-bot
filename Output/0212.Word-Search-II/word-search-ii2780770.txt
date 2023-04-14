// https://leetcode.com/problems/word-search-ii/solutions/2780770/rust-trie-dfs/
use std::collections::{HashSet, HashMap};

impl Solution {
    pub fn find_words(mut board: Vec<Vec<char>>, words: Vec<String>) -> Vec<String> {
        let mut words = Trie::from_words(words);
        let mut res = Vec::new();
        let mut temp = String::new();
        
        for i in 0..board.len() {
            for j in 0..board[0].len() {
                Self::dfs(i as i32, j as i32, &mut board, &mut words, &mut temp, &mut res);
            }
        }
        
        res.iter().collect()
    }
    
    fn dfs(i: i32, j: i32, board: &mut Vec<Vec<char>>, words: &mut Trie, curr: &mut String, res: &mut HashSet<String>) {
        if i < 0 || j < 0 || i as usize >= board.len() || j as usize >= board[0].len() || board[i as usize][j as usize] == '?' {
            return;
        }
        
        if !words.starts_with(curr.clone()) {
            return;
        }
        
        curr.push(board[i as usize][j as usize]);
        board[i as usize][j as usize] = '?';
        if words.search(curr.clone()) {
            res.insert(curr.clone());
        }
        Self::dfs(i+1, j, board, words, curr, res);
        Self::dfs(i-1, j, board, words, curr, res);
        Self::dfs(i, j+1, board, words, curr, res);
        Self::dfs(i, j-1, board, words, curr, res);
        board[i as usize][j as usize] = curr.remove(curr.len()-1);
    }
}

struct TrieNode {
    links: HashMap<char, TrieNode>,
    is_end: bool
}

impl TrieNode {
    fn new() -> Self {
        Self {
            links: HashMap::new(),
            is_end: false
        }
    }
    
    fn contains_key(&self, c: char) -> bool {
        self.links.contains_key(&c)
    }
    
    fn get(&mut self, ch: char) -> &mut TrieNode {
        self.links.get_mut(&ch).unwrap()
    }
    
    fn put(&mut self, ch: char, node: TrieNode) {
        self.links.insert(ch, node);
    }
    
    fn set_end(&mut self) {
        self.is_end = true;
    }
    
    fn is_end(&self) -> bool {
        self.is_end
    }
}

struct Trie {
    root: TrieNode
}

impl Trie {

    fn new() -> Self {
        Self {
            root: TrieNode::new()
        }
    }
    
    fn from_words(words: Vec<String>) -> Self {
        let mut trie = Self::new();
        for word in words {
            trie.insert(word);
        }
        
        trie
    }
    
    fn insert(&mut self, word: String) {
        let mut node = &mut self.root;
        let word = word.chars().collect::<Vec<char>>();
        
        for i in 0..word.len() {
            node.links.entry(word[i]).or_insert(TrieNode::new());
            node = node.get(word[i]);
        }
        node.set_end();
    }
    
    fn search(&mut self, word: String) -> bool {
        let mut node = &mut self.root;
        let word = word.chars().collect::<Vec<char>>();
        
        for i in 0..word.len() {
            if node.contains_key(word[i]) {
                node = node.get(word[i]);
            } else {
                return false;
            }
        }
        node.is_end()
    }
    
    fn starts_with(&mut self, prefix: String) -> bool {
        let mut node = &mut self.root;
        let word = prefix.chars().collect::<Vec<char>>();
        
        for i in 0..word.len() {
            if node.contains_key(word[i]) {
                node = node.get(word[i]);
            } else {
                return false;
            }
        }
        true
    }
}