<?php

namespace Design\DesignBundle\Services\PdfExterno3;

//------------------------------------------------------------------------------
use Design\DesignBundle\Services\PdfExterno3\fpdf17\FPDF;
use Design\DesignBundle\Services\PdfExterno3\VariableStream as VariableStream;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of PdfGenRotate
 *
 * @author jkober
 */


class PdfGenRotate extends FPDF {

    //put your code here
    public function __construct($orientation = 'P', $unit = 'mm', $size = 'A4') {
        parent::__construct($orientation , $unit , $size );
        //stream_wrapper_register('var', 'Design\DesignBundle\Services\PdfExterno3\VariableStream');
    }

    var $angle = 0;

    function Rotate($angle, $x = -1, $y = -1) {
        if ($x == -1)
            $x = $this->x;
        if ($y == -1)
            $y = $this->y;
        if ($this->angle != 0)
            $this->_out('Q');
        $this->angle = $angle;
        if ($angle != 0) {
            //$angle*=M_PI / 180;
            $c = cos(deg2rad($angle));
            $s = sin(deg2rad($angle));
            $cx = $x * $this->k;
            $cy = ($this->h - $y) * $this->k;
            $this->_out(sprintf('q %.5F %.5F %.5F %.5F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm', $c, $s, -$s, $c, $cx, $cy, -$cx, -$cy));
        }
    }

  /*  function _endpage() {
//        if ($this->angle != 0) {
  //          $this->angle = 0;
            $this->_out('Q');
    //    }
        parent::_endpage();
    }*/

}

?>