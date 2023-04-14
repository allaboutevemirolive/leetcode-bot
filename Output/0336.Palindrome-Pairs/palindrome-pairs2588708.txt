// https://leetcode.com/problems/palindrome-pairs/solutions/2588708/rust-trie-with-comments/
const N_LETTERS: usize = (b'z' - b'a' + 1) as _;

struct Trie<T> {
    value: Option<T>,
    children: [Option<Box<Trie<T>>>; N_LETTERS],
}

impl<T> Trie<T> {
    pub fn new() -> Self {
        Self { value: None, children: Default::default() }
    }

    pub fn insert(&mut self, s: &[u8], value: T) {
        let mut node = self;
        for b in s.iter().map(|b| (*b - b'a') as usize) {
            if node.children[b].is_none() {
                node.children[b] = Some(Box::new(Self::new()));
            }
            node = node.children[b].as_mut().unwrap();
        }
        node.value = Some(value);
    }

    pub fn find(&self, s: &[u8]) -> Option<&Trie<T>> {
        let mut node = self;
        for b in s.iter().map(|b| (*b - b'a') as usize) {
            match node.children[b].as_ref() {
                Some(child) => node = child,
                None => return None,
            }
        }
        Some(node)
    }

    fn backtrack_suffixes<'a>(&'a self, curr: &mut Vec<u8>, mut rez: Vec<(&'a T, Vec<u8>)>) -> Vec<(&'a T, Vec<u8>)> {
        if let Some(value) = self.value.as_ref() {
            rez.push((value, curr.clone()));
        }
        for (i, child_opt) in self.children.iter().enumerate() {
            if let Some(child) = child_opt.as_ref() {
                curr.push(i as u8 + b'a');
                rez = Self::backtrack_suffixes(&child, curr, rez);
                curr.pop();
            }
        }
        rez
    }

    pub fn get_suffixes(&self) -> Vec<(&T, Vec<u8>)> {
        let mut rez = vec![];
        for (i, child_opt) in self.children.iter().enumerate() {
            if let Some(child) = child_opt.as_ref() {
                rez = Self::backtrack_suffixes(child, &mut vec![i as u8 + b'a'], rez);
            }
        }
        rez
    }

}

fn is_palindrome(s: &[u8]) -> bool {
    let mut it = s.iter();
    loop {
        match (it.next(), it.next_back()) {
            (None, None) => return true,
            (Some(_), None) => return true,
            (Some(&b1), Some(&b2)) if b1 == b2 => (),
            _ => return false,
        }
    }
}

impl Solution {
    pub fn palindrome_pairs(words: Vec<String>) -> Vec<Vec<i32>> {
        let mut trie = Trie::<i32>::new();
        words.iter().zip(0..).for_each(|(word, i)| trie.insert(&word.bytes().rev().collect::<Vec<_>>(), i) );
        let mut rez = vec![];
        for (word, i) in words.iter().zip(0..).map(|(w, i)| (w.as_bytes(), i)) {
            if let Some(node) = trie.find(word) {
                if let Some(j) = node.value {
                    if i != j {
                        rez.push(vec![i, j]);
                    }
                }
                for (&j, suffix) in node.get_suffixes() {
                    if is_palindrome(&suffix) {
                        rez.push(vec![i, j]);
                    }
                }
            }
            for k in 0..word.len() {
                if is_palindrome(&word[k..]) {
                    if let Some(node) = trie.find(&word[0..k]) {
                        if let Some(j) = node.value {
                            rez.push(vec![i, j])
                        }
                    }
                }
            }
        }
        rez
    }
}