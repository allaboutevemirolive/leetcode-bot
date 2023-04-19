// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/solutions/180617/c-dp-solution-using-monoqueue-optimization-beat-99/
/* Solution Begin */
template<typename T>
class Monoqueue {
public:
    void push(T val)
    {
        q.push_back(val);
        while (!m.empty() && m.back() < val) m.pop_back();
        m.push_back(val);
    }

    void pop()
    {
        T x = q.front();
        q.pop_front();
        if (x == m.front()) m.pop_front();
    }

    int size() { return q.size(); }

    T top() { return m.front(); }

private:
    deque<T> q, m;
};

class Solution {
public:

    const int UNDEF = -1;
    int maxProfit(vector<int> &prices)
    {
        return maxProfit(prices, 2);
    }

    int maxProfit(vector<int> &prices, int k)
    {
        if (k > prices.size() / 2)
        {
            deque<int> q;
            int ans = 0;
            prices.push_back(0);
            for (int i = 0; i < prices.size(); i++)
            {
                if (!q.empty() && prices[i] < q.back())
                {
                    ans += q.back() - q.front();
                    q.clear();
                }
                q.push_back(prices[i]);
            }
            return ans;
        }
        else
        {
            int n = prices.size();
            vector<vector<int>> memo(n + 1, vector<int>(k + 1, 0));
            int ans = 0;
            for (int trans = 1; trans <= k; trans++)
            {
                Monoqueue<int> mq;
                for (int day = 1; day <= prices.size(); day++)
                {
                    mq.push(memo[day - 1][trans - 1] - prices[day - 1]);
                    memo[day][trans] = max(memo[day - 1][trans], mq.top() + prices[day]);
                }
                ans = max(ans, memo[prices.size() - 1][trans]);
            }
            return ans;
        }
    }


    /* Original DP implementation. Failed at last big test case. */
    int dp(vector<vector<int>> &memo, vector<int> price, int day, int trans)
    {
        if (day < 0) return 0;
        if (memo[day][trans] != UNDEF)
            return memo[day][trans];
        if (trans == 0) return 0;
        int no_trade = dp(memo, price, day - 1, trans);
        int trade = INT_MIN;
        for (int i = 0; i < day; i++)
            trade = max(trade, dp(memo, price, i, trans - 1) + price[day] - price[i]);
        return memo[day][trans] = max({no_trade, trade, 0});
    }
};

/* Solution End */