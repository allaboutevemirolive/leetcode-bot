// https://leetcode.com/problems/k-similar-strings/solutions/409380/rust-with-bfs/
fn k_similarity(s1: String, s2: String) -> usize {
    let string_len = s1.len();

    let mut similarity = 0;
    let mut seen = HashSet::new();
    let mut queue = VecDeque::new();
    queue.push_back(s1);

    while queue.len() > 0 {
        let mut queue_size = queue.len();
        for current_iter in 0..queue_size {
            let front = queue.pop_front().unwrap();
            if &front == &s2 { return similarity; }

            let mut i = 0;

            let mut front_itr = &front.chars();
            let mut s2_itr = &s2.chars();

            while &front.chars().skip(i).next().unwrap() == &s2.chars().skip(i).next().unwrap() { i += 1; }

            let target = s2.chars().skip(i).next().unwrap();

            let mut j = i + 1;


            while j < string_len {
                if &front.chars().skip(j).next().unwrap() == &target {
                    let string = swap_string(i, j, front.clone());
                    if seen.insert(string.clone()) {
                        queue.push_back(string);
                    }
                }


                j += 1;
            }
        }

        similarity += 1;
    }


    similarity
}

fn swap_string(i: usize, j: usize, mut s: String) -> String {
    unsafe {
        let mut slice = s.as_bytes_mut();
        let temp = slice[i];
        slice[i] = slice[j];
        slice[j] = temp;
    }

    s
}