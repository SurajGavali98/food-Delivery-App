const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'food_delivery_app',
    password: 'HGtht34@rf7T',
    port: 5432, 
  });

 

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Food Delivery app',
        version: '1.0.0',
        description: 'food delivery pricing calculation on various facotrs using a Node.js API',
      },
      servers:[
        {url:'http://localhost:3000/api'}, 
      ],
    },
  
    apis: ['./routes/*.js'], 
  };

  const specs = swaggerJsdoc(options);
  app.use('/api_docs', swaggerUi.serve, swaggerUi.setup(specs));

  app.get('/', (req, res) => { 
    res.send('Node App is '
        + 'running on this server') 
    res.end() 
}) 

/**
 * @swagger
 * /student:
 *   get:
 *     summary: Get pricing for for food item on different aspects
 *     tags: [Pricing]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{}]
 *       400:
 *         description: Bad Request
 *         content:
 *          application/json:
 *            example:
 *             error:
 *              message: "Bad Request"
 */

  app.post('/calculate_price', async (req, res) => {
    try {
      
      const { zone, organization_id, total_distance, item_type } = req.body;
  
      const query = {
        text: `SELECT pr.base_distance_in_km, pr.km_price, pr.fix_price FROM pricing pr
  left join item i on pr.item_id=i.id 
               WHERE organization_id = $1 AND i.type = $2 AND zone = $3`,
        values: [organization_id, item_type, zone]
      };
      const result = await pool.query(query);
  
      if (result.rows.length > 0) 
      {
      const { base_distance_in_km, km_price, fix_price } = result.rows[0];
      let total_price = fix_price;
      if (total_distance > base_distance_in_km) {
        total_price += (total_distance - base_distance_in_km) * km_price;
      }else
      {
          total_price+=fix_price;
      }
  
      res.json({ total_price });
      }
      else 
      {
          res.json({ total_price:'This pricing does not exist need to add it' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'There is an issue with pricing' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  