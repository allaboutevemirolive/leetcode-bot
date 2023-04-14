// https://leetcode.com/problems/maximum-frequency-stack/solutions/1086687/rust-stack-of-stacks-solution/
use std::collections::HashMap;

#[derive(Default)]
struct FreqStack {
    freq: HashMap<i32, usize>,
    group: Vec<Vec<i32>>,
}

impl FreqStack {
    fn new() -> Self {
        Default::default()
    }
    
    fn push(&mut self, x: i32) {
        let entry = self.freq.entry(x).or_insert(0);
        if *entry >= self.group.len() {
            self.group.push(Vec::new());
        }
        self.group[*entry].push(x);
        *entry += 1;
    }
    
    fn pop(&mut self) -> i32 {
        if let Some(maxfreq) = self.group.last_mut() {
            if let Some(ret) = maxfreq.pop() {
                *self.freq.entry(ret).or_default() -= 1;
                if maxfreq.is_empty() {
                    self.group.pop();
                }
                return ret;
            }
        }
        unreachable!()
    }
}