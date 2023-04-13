// https://leetcode.com/problems/word-ladder-ii/solutions/1359724/rust-bfs-backtracking-solution/
use std::collections::{HashMap, HashSet, VecDeque};

impl Solution {
    pub fn find_ladders(begin_word: String, end_word: String, word_list: Vec<String>) -> Vec<Vec<String>> {
        let mut dict = HashMap::new();
        for word in &word_list {
            for i in 0..word.len() {
                let key = String::new() + &word[..i] + "*" + &word[i + 1..];
                dict.entry(key)
                    .or_insert_with(HashSet::new)
                    .insert(word.as_str());
            }
        }
        let graph = Self::bfs(&dict, &begin_word, &word_list);
        let mut answers = Vec::new();
        let mut v = Vec::new();
        Self::backtrack(&graph, &mut v, &begin_word, &end_word, &mut answers);
        answers
    }
    fn bfs(
        dict: &HashMap<String, HashSet<&str>>,
        begin: &str,
        word_list: &[String],
    ) -> HashMap<String, HashSet<String>> {
        let mut graph = HashMap::new();
        let mut hs = word_list.iter().collect::<HashSet<_>>();
        let mut vd = VecDeque::new();
        vd.push_back(begin);
        hs.remove(&begin.to_string());
        while !vd.is_empty() {
            let mut visited = Vec::new();
            for _ in 0..vd.len() {
                if let Some(word) = vd.pop_front() {
                    let mut neighbors = HashSet::<&str>::new();
                    for i in 0..word.len() {
                        let key = String::new() + &word[..i] + "*" + &word[i + 1..];
                        if let Some(s) = dict.get(&key) {
                            neighbors.extend(s);
                        }
                    }
                    neighbors.retain(|n| hs.contains(&n.to_string()));
                    for &n in &neighbors {
                        graph
                            .entry(word.to_string())
                            .or_insert_with(HashSet::new)
                            .insert(n.to_string());
                        visited.push(n);
                        vd.push_back(n);
                    }
                }
            }
            for v in &visited {
                hs.remove(&v.to_string());
            }
        }
        graph
    }
    fn backtrack(
        graph: &HashMap<String, HashSet<String>>,
        v: &mut Vec<String>,
        begin: &str,
        end: &str,
        answers: &mut Vec<Vec<String>>,
    ) {
        if begin == end {
            let mut answer = v.clone();
            answer.push(end.to_string());
            answers.push(answer);
            return;
        }
        if let Some(s) = graph.get(begin) {
            for word in s {
                v.push(begin.to_string());
                Self::backtrack(graph, v, &word, end, answers);
                v.pop();
            }
        }
    }
}