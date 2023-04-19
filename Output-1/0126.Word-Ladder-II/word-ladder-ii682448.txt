// https://leetcode.com/problems/word-ladder-ii/solutions/682448/rust-ref-graph/
use std::cell::UnsafeCell;
use std::collections::{HashMap, HashSet, VecDeque};
use std::hash::Hash;
use std::usize;

pub struct WordGraph<'a> {
    node_map: HashMap<&'a str, GraphNode<'a, &'a str>>,
}

impl<'a> WordGraph<'a> {
    pub fn new(word_list: &'a Vec<String>) -> WordGraph<'a> {
        let mut ladder = WordGraph {
            node_map: HashMap::new(),
        };

        for word in word_list {
            ladder.node_map.insert(
                word,
                GraphNode {
                    val: word,
                    edges: UnsafeCell::new(vec![]),
                },
            );
        }

        ladder
    }

    pub fn populate_levenshtein_1_edges(&'a self) {
        let mut fragment_map: HashMap<String, HashSet<&'a str>> = HashMap::new();

        let word_fragments: Vec<(&str, Vec<String>)> = self.node_map.keys()
            .map(|word| {
                let mut fragments = vec![];
                for i in 0..word.len() {
                    let fragment = (&word[0..i]).to_string() + "*" + &word[i + 1..];
                    fragments.push(fragment.clone());
                    let entry = fragment_map.entry(fragment).or_insert(HashSet::new());
                    entry.insert(word);
                }
                (*word, fragments)
            })
            .collect();

        for (word, keys) in word_fragments {
            for key in keys {
                for val in fragment_map.get(&key).unwrap() {
                    if val != &word {
                        unsafe {
                            (*self.node_map.get::<str>(&word).unwrap().edges.get())
                                .push(self.node_map.get::<str>(&val).unwrap())
                        }
                    }
                }
            }
        }
    }

    pub fn shortest_paths(&self, a: &str, b: &str) -> Vec<Vec<String>> {
        match self.node_map.get(a) {
            Some(an) => {
                match self.node_map.get(b) {
                    Some(bn) => {
                        let mut len = usize::MAX;
                        let mut result: Vec<Vec<String>> = vec![];
                        let mut min_depth_map = HashMap::new();

                        let mut queue: VecDeque<(&GraphNode<&str>, Vec<&'a str>)> = VecDeque::new();
                        queue.push_back((an, vec![an.val]));
                        while !queue.is_empty() {
                            let (node, path) = queue.pop_front().unwrap();
                            if path.len() >= len {
                                break;
                            }
                            unsafe {
                                (*node.edges.get()).iter().for_each(|child_node| {
                                    let mut child_path = path.clone();
                                    child_path.extend(vec![child_node.val]);
                                    if child_node.val == bn.val {
                                        result.push(child_path.clone().iter().map(|s| s.to_string()).collect());
                                        len = child_path.len();
                                    } else if min_depth_map.get(child_node.val).unwrap_or(&usize::MAX) >= &child_path.len() {
                                        min_depth_map.insert(child_node.val, child_path.len());
                                        queue.push_back((child_node, child_path));
                                    }
                                })
                            }
                        }
                
                        result
                    },
                    None => vec![]
                }
            },
            None => vec![]
        }
    }
}

pub struct GraphNode<'a, T: Eq + Hash> {
    pub val: T,
    pub edges: UnsafeCell<Vec<&'a GraphNode<'a, T>>>,
}

impl Solution {
    pub fn find_ladders(begin_word: String, end_word: String, mut word_list: Vec<String>) -> Vec<Vec<String>> {
        if !word_list.contains(&begin_word) {
            word_list.push(begin_word.clone());
        }
        let ladder = WordGraph::new(&word_list);
        ladder.populate_levenshtein_1_edges();
        ladder.shortest_paths(&begin_word, &end_word)
    }
}