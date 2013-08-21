<?php
namespace Design\DesignBundle\Services\PdfExterno3;
use Design\DesignBundle\Services\PdfExterno3\tcpdf\tcpdf ; 


/**
 * Description of PhpGenTcpdf
 *
 * @author JKober
 */
class PhpGenPdfTcpdf  extends TCPDF{
    //put your code here
    public function SetMargins($left, $top, $right=-1, $keepmargins=false) {
        parent::SetMargins($left, $top, $right, $keepmargins);
        $this->setHeaderMargin($top);
    }
    public function Image($file, $x='', $y='', $w=0, $h=0, $type='', $link='', $align='', $resize=false, $dpi=300, $palign='', $ismask=false, $imgmask=false, $border=0, $fitbox=false, $hidden=false, $fitonpage=false, $alt=false, $altimgs=array()) {
        if (is_null ($x)) {
            $x="";
        }
        if (is_null ($y)) {
            $y="";
        }
        parent::Image($file, $x, $y, $w, $h, $type, $link, $align, $resize, $dpi, $palign, $ismask, $imgmask, $border, $fitbox, $hidden, $fitonpage, $alt, $altimgs);
        return $this->getY();
    }
    
}

?>
