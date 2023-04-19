// https://leetcode.com/problems/the-skyline-problem/solutions/2356730/rust-segment-tree/
use std::collections::BTreeSet;
use std::collections::HashMap;

impl Solution {
    pub fn get_skyline(buildings: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let mut bts = BTreeSet::new();
        for b in &buildings {
            bts.insert(b[0]);
            bts.insert(b[1]);
            bts.insert(b[1] - 1);
        }

        let v = bts.into_iter().collect::<Vec<_>>();
        let n = v.len();
        let mut mp = HashMap::<i32, usize>::new();
        for i in 0 .. n { mp.insert(v[i], i); }

        let mut tree = vec![(0, 0); 4 * n];
        for b in buildings {
            Self::update(1, 0, n - 1, *mp.get(&b[0]).unwrap(), *mp.get(&(b[1] - 1)).unwrap(), b[2], &mut tree);
        }

        let mut height = 0;
        let mut ret = vec![];
        for i in 0 .. n {
            let temp = Self::get(1, 0, n - 1, i, &mut tree);
            if temp != height { ret.push(vec![v[i], temp]); }
            height = temp;
        }
        ret
    }

    fn update(u: usize, left: usize, right: usize, l: usize, r: usize, val: i32, tree: &mut Vec<(i32, i32)>) {
        if l <= left && right <= r {
            tree[u].0 = tree[u].0.max(val);
            return  
        }

        if l > right || r < left { return }

        let mid = left + (right - left) / 2;

        Self::update(2 * u, left, mid, l, r, val, tree);
        Self::update(2 * u + 1, mid + 1, right, l, r, val, tree);
    }

    fn get(u: usize, left: usize, right: usize, i: usize, tree: &mut Vec<(i32, i32)>) -> i32 {
        if left == right { return tree[u].0.max(tree[u].1) }

        let mid = left + (right - left) / 2;

        if tree[u].0 > 0 {
            tree[2 * u].0 = tree[2 * u].0.max(tree[u].0);
            tree[2 * u + 1].0 = tree[2 * u + 1].0.max(tree[u].0);
            tree[u].1 = tree[u].1.max(tree[u].0);
            tree[u].0 = 0; 
        }

        if i <= mid { Self::get(2 * u, left, mid, i, tree) } else { Self::get(2 * u + 1, mid + 1, right, i, tree) }
    }
}