// https://leetcode.com/problems/stamping-the-sequence/solutions/2458124/rust-windows-idiomatic-solution/
impl Solution {
    pub fn moves_to_stamp(stamp: String, target: String) -> Vec<i32> {
        let st: Vec<_> = stamp.chars().collect();
        let mut tgt: Vec<_> = target.chars().collect();
        let mut ret = Vec::new();

        fn f(o: Option<i32>, (&c1, &c2): (&char, &char)) -> Option<i32> {
            match (o, c1 == c2, c1 == '?') {
                (Some(v), true, _) => Some(v + 1),
                (Some(v), _, true) => Some(v),
                _ => None,
            }
        }

        for _ in 0..10 * tgt.len() {
            let mut to_rem = None;
            for (i, w) in tgt.windows(st.len()).enumerate() {
                let n_rem = w.iter().zip(&st).fold(Some(0), f);
                if n_rem.is_some() && n_rem.unwrap() >= 1 {
                    to_rem = Some(i);
                    break;
                }
            }
            if let Some(i) = to_rem {
                ret.push(i as i32);
                tgt[i..i + st.len()].iter_mut().for_each(|c| *c = '?');
            } else {
                break;
            }
        }

        if tgt.iter().all(|&c| c == '?') {
            ret.reverse();
            ret
        } else {
            Vec::new()
        }
    }
}