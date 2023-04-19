// https://leetcode.com/problems/minimum-window-substring/solutions/1454912/looking-for-help-for-my-time-exceed-solution-in-rust/
pub fn min_window(s: String, t: String) -> String {
    let mut hmap: HashMap<char, i32> = HashMap::new();
    for c in t.chars() {
        let state = hmap.entry(c).or_insert(0);
        *state += 1;
    }

    let mut counter = t.len();
    let (mut start, mut end) = (0, 0);
    let mut min_start = 0;
    let mut min_len = usize::MAX;

    for c in s.chars() {
        let state_end = hmap.entry(c).or_insert(0);
        if *state_end > 0 {
            counter -= 1;
        }
        *state_end -= 1;
        end += 1;

        while counter == 0 {
            if (end - start) < min_len {
                min_start = start;
                min_len = end - start;
            }

            let state_start = hmap.entry(s.chars().nth(start).unwrap()).or_insert(0);
            *state_start += 1;
            if *state_start > 0 {
                counter += 1;
            }
            start += 1;
        }
    }

    if s.len() < min_len {
        String::from("")
    } else {
        s.chars().skip(min_start).take(min_len).collect()
    }
}