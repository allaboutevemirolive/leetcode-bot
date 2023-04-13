// https://leetcode.com/problems/max-points-on-a-line/solutions/3187212/rust-with-delta-vector-normalization-between-points-all-to-all-without-floats/
impl Solution {
    pub fn max_points(ps: Vec<Vec<i32>>) -> i32 {
        if ps.len() == 1 {
            return 1;
        }
        use std::collections::HashMap;
        use std::cmp;
        let mut res = 0;
        for i in 0..ps.len() {
            let mut map = HashMap::new();
            for j in 0..ps.len() {
                let mut d = (ps[i][0] - ps[j][0], ps[i][1] - ps[j][1]);
                let len = cmp::max(d.0.abs(), d.1.abs());
                if len != 0 { //int only vector normalization
                    d.0 = d.0*0x100000/len; 
                    d.1 = d.1*0x100000/len;
                    if let Some(v) = map.get_mut(&d) {
                        *v += 1;
                        res = cmp::max(res, *v);
                    } else {
                        map.insert(d, 1);
                        res = cmp::max(res, 1);
                    }                
                }
            }
        }
        return res+1;
    }
}