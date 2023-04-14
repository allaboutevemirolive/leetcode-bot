// https://leetcode.com/problems/word-search-ii/solutions/2929421/clean-rust-trie-solution-32ms-beats-99-11-and-3-0mb-beats-94-69/
use std::collections::{BTreeMap, HashSet};
use std::convert::TryInto;

impl Solution {
    pub fn find_words(mut board: Vec<Vec<char>>, words: Vec<String>) -> Vec<String> {
        let width = board[0].len();
        let height = board.len();

        // Optimization: skip words that have letters not on our board.
        let mut letters: HashSet<_> = board.iter().flat_map(|row| row.iter().map(|c| *c as u8)).collect();
        let word_count = words.len();
        let mut words = {
            let max_len = width * height;
            let mut trie = Trie::new();
            for w in words {
                if w.len() > max_len || !w.as_bytes().iter().all(|c| letters.contains(&c)) {
                    // println!("Skipping {w}");
                    continue;
                }
                trie.insert(w.as_bytes());
            }
            trie
        };

        let mut results = Vec::new();
        if words.is_empty() {
            return results;
        }

        // Replace char board with u8 board to make it 4x smaller and fit in the cache better.
        let mut board: Vec<Vec<u8>> = board.into_iter().map(|row| row.into_iter().map(|c| c as u8).collect()).collect();
        // Try all possible start positions.
        'both: for x in 0..width {
            for y in 0..height {
                let cell = (x as i8, y as i8);
                Self::solve(&mut *board, cell, &mut words, &mut String::new(), &mut results);
                if results.len() == word_count {
                    break 'both;
                }
            }
        }

        results
    }

    fn solve(board: &mut [Vec<u8>], cell: (i8, i8), words: &mut Trie, word: &mut String, results: &mut Vec<String>) {
        let (letter, trie) = {
            let letter = &mut board[cell.1 as usize][cell.0 as usize];
            let trie = match words.children.get_mut(letter) {
                Some(trie) => trie,
                None => return,
            };
            // Replace letter on grid with a null (`u8::default()`)
            (std::mem::take(letter), trie)
        };

        word.push(letter as char);
        if trie.is_end {
            // Remove this word from the trie
            trie.is_end = false;
            results.push(word.clone());
        }

        let width = board[0].len().try_into().unwrap();
        let height = board.len().try_into().unwrap();
        // We already know trie.is_end is false at this point, so the only other component 
        // for trie.is_empty() to return true would be for trie.children.is_empty() to be true.
        let mut prune_child = trie.children.is_empty();
        if !prune_child {
            let mut neighbors = [(cell.0 - 1, cell.1), (cell.0 + 1, cell.1), (cell.0, cell.1 - 1), (cell.0, cell.1 + 1)];
            for (x, y) in neighbors {
                if x < 0 || x >= width || y < 0 || y >= height {
                    continue;
                }
                if board[y as usize][x as usize] as u8 == 0 {
                    // Letter in use by same word
                    continue;
                }
                Self::solve(&mut *board, (x, y), trie, &mut *word, &mut *results);
                if trie.children.is_empty() {
                    prune_child = true;
                    break;
                }
            }
        }

        if prune_child {
            // Trie::remove() is recursive and prevents us from even considering nodes that are now empty going forward.
            words.children.remove(&letter);
        }

        // Undo changes to "global" state
        word.pop();
        board[cell.1 as usize][cell.0 as usize] = letter;
    }
}

#[derive(Debug, Clone)]
struct Trie {
    children: BTreeMap<u8, Box<Trie>>,
    is_end: bool,
}

impl Trie {
    #[inline(always)]
    fn new() -> Self {
        Trie {
            children: BTreeMap::new(),
            is_end: false,
        }
    }

    #[inline(always)]
    fn get(&self, path: &[u8]) -> Option<&Trie> {
        let mut current = self;
        for ch in path {
            current = match current.children.get(&ch) {
                Some(node) => node,
                None => return None,
            }
        }

        return Some(current);
    }

    #[inline(always)]
    fn get_mut(&mut self, path: &[u8]) -> Option<&mut Trie> {
        let mut current = self;
        for ch in path {
            current = match current.children.get_mut(&ch) {
                Some(node) => node,
                None => return None,
            }
        }

        return Some(current);
    }

    #[inline(always)]
    fn remove(&mut self, key: &[u8]) -> bool {
        if key.is_empty() {
            // If the key is empty, we can simply set is_end to false
            return std::mem::take(&mut self.is_end);
        }

        let first_char = key[0];
        let child = match self.children.get_mut(&first_char) {
            Some(child) => child,
            None => return false,
        };
        let result = child.remove(&key[1..]);

        // If this caused the child to become empty, remove it.
        if child.is_empty() {
            self.children.remove(&first_char);
        }

        // If child has no children and is_end is false, we can remove it
        return result;
    }

    #[inline]
    fn insert(&mut self, word: &[u8]) -> bool {
        let mut current = self;
        'outer: for ch in word {
            current = current.children.entry(*ch)
                .or_insert(Box::new(Trie::new()));
        }

        let inserted = current.is_end == false
        current.is_end = true;
        return inserted;
    }

    #[inline(always)]
    fn contains(&self, word: &[u8]) -> bool {
        match self.get(word) {
            Some(node) => node.is_end,
            None => false,
        }
    }

    #[inline(always)]
    fn is_empty(&self) -> bool {
        !self.is_end && self.children.is_empty()
    }
}