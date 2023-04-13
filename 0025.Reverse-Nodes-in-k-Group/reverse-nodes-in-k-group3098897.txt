// https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/3098897/rust-o-1-mem-safe-moving-nodes-0ms/
type NodeOpt = Option<Box<ListNode>>;

impl Solution {
    pub fn reverse_k_group(head: NodeOpt, k: i32) -> NodeOpt {
        let mut source = head;
        let mut dest   = None;
        let mut tail   = &mut dest;

        while source.is_some() {
            let mut len = 0;
            while let Some(mut n) = source.take() {
                source = n.next.take();
                n.next = tail.take();
                *tail  = Some(n);
                len   += 1;
                if len == k { break; }
            }
            if len == k {
                for _ in 0..k {
                    tail = &mut tail.as_mut().unwrap().next;
                }
            } else {
                source = tail.take();
                while let Some(mut n) = source.take() {
                    source = n.next.take();
                    n.next = tail.take();
                    *tail  = Some(n);
                }
            }
        }
        dest
    }
}