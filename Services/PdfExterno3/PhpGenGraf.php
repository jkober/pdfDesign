<?php

namespace Design\DesignBundle\Services\PdfExterno3;
use Design\DesignBundle\Services\PdfExterno3\VariableStream;

$dir = dirname(__DIR__) . "/PdfExterno3/";
require_once($dir . 'jpgraph/src/jpgraph.php');
require_once($dir . 'jpgraph/src/jpgraph_pie.php');
require_once ($dir . "jpgraph/src/jpgraph_pie3d.php");

class PhpGenGraf {

    /**
     * 
     * @return \PieGraph
     */
    public function getPieGraph() {
        return new \PieGraph();
    }

    public function getPiePlot3D($dt) {
        return new \PiePlot3D($dt);
    }

    public function getRenderB64($resource,$obj) {
        ob_start();
        imagepng($resource);
        //$PhpGenGraph
        $data = ob_get_clean();
        //------------------------------------------------------------------
        stream_wrapper_register('var', 'Design\DesignBundle\Services\PdfExterno3\VariableStream');
        //------------------------------------------------------------------
        VariableStream::$file["mipng"] = $data;
        $a = getimagesize('var://mipng');
        //------------------------------------------------------------------
        $obj->PositionWidth = $obj->PositionWidth * (96 / 25.4);
        $obj->PositionHeight = $obj->PositionWidth * $a[1] / $a[0];
        //------------------------------------------------------------------
        $gd = imagecreatetruecolor($obj->PositionWidth, $obj->PositionHeight);
        imagecopyresized($gd, $resource, 0, 0, 0, 0, $obj->PositionWidth, $obj->PositionHeight, $a[0], $a[1]); //, $width, $height);
        //------------------------------------------------------------------
        ob_start();
        imagepng($gd);
        return base64_encode(ob_get_clean());
    }

}

?>
