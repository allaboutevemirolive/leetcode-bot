// https://leetcode.com/problems/orderly-queue/solutions/2786129/rust-sort-for-k1-dp-for-k-1-2ms-2mb/
    pub fn orderly_queue(s: String, k: i32) -> String {
        use std::cmp::Ordering;
        if s.len() < 2 {
            return s;
        }
        if k > 1 {
            let mut v = Vec::from(s);
            v.sort();
            return String::from_utf8(v).unwrap();
        }
        // k =1
        let (mut min, mut cmp, mut len) = (0usize, 1usize, 1usize);
        let v = s.chars().chain(s.chars()).collect::<Vec<char>>();

        while cmp < s.len() {
            match &v[min..min + len].cmp(&v[cmp..cmp + len]) {
                Ordering::Less => {
                    cmp += 1;
                    len = 1;
                }
                Ordering::Greater => {
                    min = cmp;
                    cmp += 1;
                    len = 1;
                }
                Ordering::Equal => {
                    if len < s.len() {
                        len += 1;
                    } else {
                        cmp += 1;
                        len = 1
                    }
                }
            }
        }
        v[min..min + s.len()].iter().collect()
    }
}