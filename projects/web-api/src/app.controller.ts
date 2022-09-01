import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as Multipassify from 'multipassify';
import { Multipass } from 'multipass-js';

@Controller()
export class AppController {
  @Get('health')
  getHealth(): string {
    return 'ok';
  }

  @Get(`product/:productId`)
  getProduct(@Param('productId') productId: string, @Res() resp: Response) {
    console.log(productId);
    const multipass = new Multipass('a8c55ea02f3f524ddea89b6a50555956');
    const customerData = {
      email: 'carlos.rgn@gmail.com',
    };
    const url = multipass
      .withCustomerData(customerData)
      .withDomain('rhyeks-test-store-1.myshopify.com')
      .withRedirect(
        'https://rhyeks-test-store-1.myshopify.com/products/a-virtual-box-of-chocolates',
      )
      .url();
    console.log(url);
    return resp.json({ url });
  }
}
