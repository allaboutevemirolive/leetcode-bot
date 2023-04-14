// https://leetcode.com/problems/bus-routes/solutions/3301771/rust-version-of-the-java-code-in-the-editorial/
use std::collections::HashSet;
use std::collections::VecDeque;

impl Solution {
    pub fn num_buses_to_destination(mut routes: Vec<Vec<i32>>, source: i32, target: i32) -> i32 {
        if source == target { return 0; }

        let n = routes.len();
        for i in 0..n { routes[i].sort(); }

        let mut graph:   Vec<Vec<usize>>         = vec![ Vec::new(); routes.len() ];
        let mut seen:    HashSet<usize>          = HashSet::new();
        let mut targets: HashSet<usize>          = HashSet::new();
        let mut queue:   VecDeque<(usize,usize)> = VecDeque::new();

        for i in 0..n {
            for j in (i+1)..n {
                if intersect(&routes[i], &routes[j]) {
                    graph.get_mut(i).unwrap().push(j);
                    graph.get_mut(j).unwrap().push(i);
                }
            }
        }

        for i in 0..n {
            if binary_search(&routes[i], source) {
                seen.insert(i);
                queue.push_back((i,0));
            }
            if binary_search(&routes[i], target) {
                targets.insert(i);
            }
        }

        while let Some((node,depth)) = queue.pop_front() {
            if targets.contains(&node) { return depth as i32 + 1; }
            for &nei in graph.get(node).unwrap() {
                if !seen.contains(&nei) {
                    seen.insert(nei);
                    queue.push_back((nei,depth+1));
                }
            }
        }

        -1
    }
}

fn intersect(a: &Vec<i32>, b: &Vec<i32>) -> bool {
    let mut i = 0; let mut j = 0;
    while (i < a.len() && j < b.len()) {
        if a[i] == b[j] { return true; }
        if a[i] <  b[j] { i += 1; } else { j += 1; }
    }
    false
}

fn binary_search(routes: &Vec<i32>, n: i32) -> bool {
    let mut l = 0; let mut r = routes.len()-1;
    while l <= r {
        let mid = (l+r)/2;
        if routes[mid] == n { return true; }
        if routes[mid] <  n { l = mid+1; }
        if routes[mid] >  n { r = mid-1; if mid == 0 { break; } }
    }
    false
}