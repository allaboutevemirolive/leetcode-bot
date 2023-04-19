// https://leetcode.com/problems/word-break-ii/solutions/547750/rust-dp-trie-0ms/
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

pub struct Node {
    pub value: char,
    pub is_leaf: bool,
    pub children: HashMap<char, Rc<RefCell<Node>>>,
}

impl Node {
    pub fn new(chr: char) -> Node {
        Node {
            value: chr,
            is_leaf: false,
            children: HashMap::new(),
        }
    }
}

pub struct Trie {
    root: Rc<RefCell<Node>>,
}

impl Trie {
    pub fn new() -> Trie {
        Trie {
            root: Rc::new(RefCell::new(Node::new('$'))),
        }
    }

    pub fn add_word(&self, word: &str) {
        let mut node = Rc::clone(&self.root);
        for chr in word.chars() {
            let clonned = {
                let mut current_node = node.borrow_mut();
                let entry = current_node
                    .children
                    .entry(chr)
                    .or_insert(Rc::new(RefCell::new(Node::new(chr))));

                Rc::clone(entry)
            };

            node = clonned;
        }

        node.borrow_mut().is_leaf = true;
    }

    pub fn find_occurences(&self, word: &str) -> Vec<String> {
        let mut result: Vec<String> = Vec::new();
        let mut node = Rc::clone(&self.root);
        let mut current_word = String::new();

        for chr in word.chars() {
            node = if let Some(x) = Rc::clone(&node).borrow().children.get(&chr) {
                Rc::clone(x)
            } else {
                break;
            };

            current_word.push(node.borrow().value);
            if node.borrow().is_leaf {
                result.push(current_word.clone());
            }
        }

        result
    }
}

impl Solution {
    pub fn word_break(s: String, word_dict: Vec<String>) -> Vec<String> {
        let trie: Trie = Solution::create_trie(word_dict);

        let mut dp: HashMap<usize, Vec<String>> = HashMap::new();
        Solution::dfs(&mut dp, &s, &trie, s.len()).clone()
    }

    fn create_trie(word_dict: Vec<String>) -> Trie {
        let trie = Trie::new();
        for word in word_dict.iter() {
            trie.add_word(word);
        }

        trie
    }

    fn dfs<'a>(
        dp: &'a mut HashMap<usize, Vec<String>>,
        s: &str,
        trie: &Trie,
        end: usize,
    ) -> &'a Vec<String> {
        if s.len() == 0 {
            return dp.entry(end).or_insert(vec![String::new()]);
        }

        if dp.contains_key(&end) {
            return &dp[&end];
        }

        let mut result: Vec<String> = vec![];
        for occurence in trie.find_occurences(s) {
            let len = occurence.len();
            let next = Solution::dfs(dp, &s[len..], trie, end - len);

            for sentence in next {
                if sentence.len() > 0 {
                    result.push(occurence.clone() + " " + &sentence);
                } else {
                    result.push(occurence.clone());
                }
            }
        }

        dp.entry(end).or_insert(result)
    }
}