// https://leetcode.com/problems/find-the-shortest-superstring/solutions/1226502/rust-dynamic-programming/
use std::usize;


impl Solution {
    
    fn recurse(
        dp: &mut Vec<Vec<Option<(usize, Option<usize>)> >>, 
        edges: &Vec<Vec<usize>>,
        set: usize,  
        dest: usize
    )  {
        if dp[set][dest].is_some() {
            return;
        }
        let prev_set  = set & ( !(1<<dest) );
        let mut best = usize::MAX;
        let mut best_i = 0; 
        
        for i in 0..edges.len() {
            if i == dest { continue };
            if ((1 << i) & prev_set) == 0 { continue };
            Self::recurse(dp, edges, prev_set, i);
            let w = (dp[prev_set][i].as_ref().unwrap().0) + edges[i][dest];
            if w < best {
                best = w;
                best_i = i;
            }
        }
        dp[set][dest] = Some((best, Some(best_i)));
    }
    
    pub fn shortest_superstring(mut words: Vec<String>) -> String {

        let mut edges =  vec![vec![0; words.len()]; words.len()];
                
        for i in 0..words.len() {
            for j in 0..words.len() {
                if i == j { continue; }

                let mut best = 0;
                let w1 = words[i].as_bytes();
                let w2 = words[j].as_bytes();
                let max_overlap = w1.len().min(w2.len());

                for k in (1..=max_overlap) {
                    if w1[..k] == w2[(w2.len() - k)..] {
                        best = k;    
                    }
                }
                edges[j][i] = w1.len() - best;
            }
        }
        let total_sets = (2i32.pow(words.len() as u32)) as usize;
        let mut dp = vec![vec![None; words.len()]; total_sets];
        let full_set = (2i32.pow((words.len()) as u32) -1) as usize;
        for i in 0..words.len() {
            let set = (1 << i);
            dp[set][i] = Some((words[i].as_bytes().len(), None));
        }
        let mut best = (usize::MAX, None);
        for i in 0..words.len() {
            Self::recurse(&mut dp, &edges, full_set, i);
            let s = (dp[full_set][i].as_ref().unwrap()).0;
            if best.0 > s {
                best = (s, Some(i));
            }
        }
       
        let mut order = vec![];
        let mut cur = Some((best.1.unwrap(), full_set));
        while let Some((index, set)) = cur {
            order.push(index);
            let next_set = set & (!(1<<index));
            if let Some(&(_, o_n)) = dp[set][index].as_ref() {
                if let Some(n) = o_n {
                    cur = Some((n, next_set));    
                }  else {
                    cur = None;
                }   
            } else {
                cur = None;    
            } 
        }
        order.reverse();
        let mut answer = words[order[0]].clone();
        for i in 1..(order.len()) {
            let add = edges[order[i-1]][order[i]];
            let size = words[order[i]].len();
            answer.push_str(&words[order[i]][size-add..]);
        }

        

        answer
    }
}