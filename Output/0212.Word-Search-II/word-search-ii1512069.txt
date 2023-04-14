// https://leetcode.com/problems/word-search-ii/solutions/1512069/rust-two-approaches-using-a-trie-8ms-2-1mb/
impl Solution {
    pub fn find_words(board: Vec<Vec<char>>, words: Vec<String>) -> Vec<String> {
        find_words(board, words)
    }
}

use std::collections::HashMap;

#[derive(Default, Debug)]
struct Node {
    ptr: HashMap<u8, Node>,
}

impl Node {
    pub fn new() -> Self {
        Default::default()
    }

    pub fn starts_with<W: AsRef<[u8]>>(&self, prefix: W) -> bool {
        self.find(prefix).is_some()
    }

    fn find<W: AsRef<[u8]>>(&self, word: W) -> Option<&Node> {
        let word = word.as_ref();

        let mut node = self;
        for ch in word.iter() {
            match node.ptr.get(ch) {
                Some(link) => node = link,
                None => return None,
            }
        }

        Some(node)
    }
	
    pub fn insert_next(&mut self, ch: u8) -> &mut Node {
        self.ptr.entry(ch).or_default()
    }
}

pub fn find_words(mut board: Vec<Vec<char>>, mut words: Vec<String>) -> Vec<String> {
    let max_depth = match words.iter().map(|w| w.len()).max() {
        None => return words,
        Some(len) => len,
    };

    let mut trie = Node::new();

    for r in 0..board.len() {
        for c in 0..board[r].len() {
            dfs(&mut board, &mut trie, max_depth, 0, r, c)
        }
    }

    words.retain(|w| trie.starts_with(w));
    words
}

fn dfs(
    board: &mut Vec<Vec<char>>,
    trie: &mut Node,
    max_depth: usize,
    depth: usize,
    r: usize,
    c: usize,
) {
    let ch = board[r][c] as u8;
    if ch == 0 {
        return;
    }

    let trie = trie.insert_next(ch);
    if depth + 1 == max_depth {
        return;
    }

    board[r][c] = 0 as char;

    if r > 0 {
        dfs(board, trie, max_depth, depth + 1, r - 1, c);
    }
    if r < board.len() - 1 {
        dfs(board, trie, max_depth, depth + 1, r + 1, c);
    }
    if c > 0 {
        dfs(board, trie, max_depth, depth + 1, r, c - 1);
    }
    if c < board[r].len() - 1 {
        dfs(board, trie, max_depth, depth + 1, r, c + 1);
    }

    board[r][c] = ch as char;
}