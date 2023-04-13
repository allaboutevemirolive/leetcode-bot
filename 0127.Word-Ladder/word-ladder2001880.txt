// https://leetcode.com/problems/word-ladder/solutions/2001880/rust-solution/
use std::collections::*;

fn dijkstra(
  n: usize,
  default_val: usize,
  graph: &Vec<Vec<(usize, usize)>>,
  start: usize
) -> Vec<usize> {
  let mut score = vec![default_val;n];
  let mut pq = BinaryHeap::new();
  score[start] = 0;
  pq.push(std::cmp::Reverse((0, start)));
  while let Some(std::cmp::Reverse((w_u, u))) = pq.pop() {
    if score[u] < w_u {
      continue
    }
    
    for &(v, w_v) in graph[u].iter() {
      let w = w_u + w_v;
      if w < score[v] {
        score[v] = w;
        pq.push(std::cmp::Reverse((w, v)));
      }
    }
  }
  score
}

impl Solution {
  pub fn ladder_length(begin_word: String, end_word: String, mut word_list: Vec<String>) -> i32 {
    let mut flag = false;
    let mut ti = 0;
    for i in 0..word_list.len() {
      if word_list[i] == end_word {
        flag = true;
        ti = i + 1;
      }
    }

    if !flag {
      return 0
    }
    
    let len = begin_word.len();
    word_list.insert(0, begin_word);
    let n = word_list.len();
    let mut g = vec![vec![];n];
    
    for i in 0..len {
      let mut map = HashMap::new();
      for j in 0..n {
        let v = &word_list[j];
        let nv = format!("{}{}", &v[0..i], &v[i+1..len]);
        let entry = map.entry(nv).or_insert(vec![]);
        entry.push(j);
      }

      for (_, arr) in map {
        let len = arr.len();
        if len <= 1 {
          continue
        }
        for j in 0..len {
          for k in j+1..len {
            let jv = arr[j];
            let kv = arr[k];
            g[jv].push((kv, 1));
            g[kv].push((jv, 1));
          }
        }
      }
    }

    let inf = 100000;
    let result = dijkstra(n, inf, &g, 0);
    if result[ti] == inf {
      0
    } else {
      result[ti] as i32 + 1
    }
  }
}