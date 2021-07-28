# Setup

1. Run `npm install`
2. Run `npm run start`
3. Go to `http://localhost:4000`
4. Klick on the button to go to Apollo Studio

# Reproduce the issue

The following query works as expected

```gql
query Test {
  xx_missions {
    payloads {
      orbit_params {
        eccentricity
      }
    }
  }
}
```

<details>
<summary>Results</summary>
<pre><code>
{
  "data": {
    "xx_missions": [
      {
        "payloads": [
          {
            "orbit_params": {
              "eccentricity": 0.0001981
            }
          },
          {
            "orbit_params": {
              "eccentricity": 0.0001844
            }
          }
        ]
      },
      {
        "payloads": [
          {
            "orbit_params": {
              "eccentricity": 0.0002221
            }
          },
          {
            "orbit_params": {
              "eccentricity": 0.0001916
            }
          }
        ]
      }
      // ...
    ]
  }
}
</code>
</pre>
</details>

The and returns data all the way down to `eccentricity`.

But once we alias `payloads`, it will always return `null`:

```gql
query Test {
  xx_missions {
    myPayloads: payloads {
      orbit_params {
        eccentricity
      }
    }
  }
}
```

<details>
<summary>Results</summary>
<pre><code>
{
  "data": {
    "xx_missions": [
      {
        "myPayloads": null
      },
      {
        "myPayloads": null
      },
      // ...
    ]
  }
}
</code>
</pre>
</details>

In this case all the fields are optional, but if they aren’t the query will fail, but even with optional fields, this is not the expected behavior.