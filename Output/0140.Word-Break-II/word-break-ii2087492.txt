// https://leetcode.com/problems/word-break-ii/solutions/2087492/rust-backtracking/
use std::collections::HashSet;

pub fn word_break<S: AsRef<str>>(s: S, word_dict: Vec<String>) -> Vec<String> {
    let words = word_dict.into_iter().collect::<HashSet<_>>();
    let mut answer = vec![];
    let mut buffer = vec![];

    backtrack(s.as_ref(), 0, &words, &mut answer, &mut buffer);

    answer
}

fn backtrack<'l>(
    s: &'l str,
    from: usize,
    words: &HashSet<String>,
    answer: &mut Vec<String>,
    buffer: &mut Vec<&'l str>,
) {
    if s[from..].is_empty() {
        let sentence = buffer.join(" ");
        answer.push(sentence);
        return;
    }

    for to in from + 1..s.len() + 1 {
        if words.contains(&s[from..to]) {
            buffer.push(&s[from..to]);
            backtrack(s, to, words, answer, buffer);
            buffer.pop();
        }
    }
}